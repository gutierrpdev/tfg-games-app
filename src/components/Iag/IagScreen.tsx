import React, { useState, useEffect, useCallback } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import { GamesPanel } from '../Games/GamesPanel';

import { QuestionsPanel } from '../Questions/QuestionsPanel';
import { API_BASE_URL } from '../../constants/apiConstants';
import { UnityLoader } from '../UnityLoader/UnityLoader';
import { YoutubeVideo } from '../YoutubeVideo/YoutubeVideo';
import { Route, useHistory, Link } from 'react-router-dom';

import jwt_decode from 'jwt-decode';

interface UserData {
  blekCompleted: boolean;
  edgeCompleted: boolean;
  unpossibleCompleted: boolean;
  userId: string;
  userAge: number;
  userGender: string;
  questionsCompleted: boolean;
};


export const Iag: React.FC = () => {

  // User Data
  const [userData, setUserData] = useState<UserData | undefined>(undefined);

  // use history
  let history = useHistory();

  const getProfile = useCallback(() => {

    /*
    setUserData({
      blekCompleted: true,
      unpossibleCompleted: false,
      edgeCompleted: true,
      questionsCompleted: true,
      userAge: 27,
      userId: 'test27',
      userGender: 'Male',
    });
    return;*/

    // TODO: Move to api.
    fetch(API_BASE_URL + 'users/me', {
      method:"GET",
      /*credentials : 'include',*/
      headers: {
        'Accept': 'application/json'
      }
    })
    .then((data) => {
      return data.json();
    })
    .then((res)=>{
      // TODO: This could be anything, validate data.
      const user: UserData = res as UserData;
      setUserData(user);
      if(user.questionsCompleted){
        history.push('/profile/games');
      }
      else {
        history.push('/profile/questions');
      }
    })
    .catch(e => {
      // Remove local session and return to login screen.
      localStorage.removeItem('iagSession');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      history.push('/login');
    });
  }, [history]);

  // Get user profile on first load.
  useEffect(() => {
    if(isLoggedIn()){
      const user = localStorage.getItem('user');
      if(user === null) history.push('/login');
      else {
        const userParsed = JSON.parse(user) as UserData;
        setUserData(userParsed);
        userParsed.questionsCompleted? history.push('/profile/games') : history.push('/profile/questions');
      }
    }
    else {
      history.push('/login');
    }
  }, [history, getProfile]);

  // TODO: move to api
  function handleLogout() {
    const body = {
      token: localStorage.getItem('token')
    };

    fetch(API_BASE_URL + 'users/logout', {
      method:"POST",
      /* credentials : 'include' */
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    })
    .then((res) => {
      localStorage.removeItem('iagSession');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      history.push('/login');
    })
    .catch(err => {
      console.log(err);
    })
  }

  function onGameSelect(gameName: string){
    gameName === 'blek' ? history.push('/profile/blek-video') : history.push('/profile/' + gameName);
  }
  
  function onGameOver(gameName: string){
    setUserData(prevState => (prevState? { 
      ...prevState,
      blekCompleted: userData?.blekCompleted || gameName === 'blek',
      unpossibleCompleted: userData?.unpossibleCompleted || gameName === 'unpossible',
      edgeCompleted: userData?.edgeCompleted || gameName === 'edge',
    }: undefined));
    history.push('/profile/games');
  }

  function onQuestionsCompleted(){
    setUserData(prevState => (prevState? { 
      ...prevState,
      questionsCompleted: true,
    }: undefined));
    history.push('/profile/games');
  }

  if(!userData){
    return <p>Loading user data...</p>;
  }

  return (
    <div>
      <Helmet>
        <title>Juegos TFG</title>
      </Helmet>

      <Menu>
      {/* Only display games link if not in questions screen */}
      {history.location.pathname !== 'questions' && (
        <Link to='/profile/games'>
          <Menu.Item name="games">
            <Icon name="gamepad" />
            Juegos
          </Menu.Item>
        </Link>)}

        <Menu.Menu position='right'>
          <Menu.Item name="logout" 
            onClick={() => handleLogout()}
          >
            <Icon name="power" />
            Cerrar Sesión
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Route path='/profile/games'>
        <GamesPanel 
          blekCompleted={userData.blekCompleted}
          unpossibleCompleted={userData.unpossibleCompleted}
          edgeCompleted={userData.edgeCompleted}
          onGameSelect={onGameSelect}
        />
      </Route>
      <Route path='/profile/blek-video'>
        <YoutubeVideo
          videoId="N5pWe61TzPA"
          onVideoEnd={() => history.push('/profile/blek')}
        />
      </Route>
      <Route path='/profile/blek'>
        <UnityLoader
          buildName="BlekWeb"
          gameName="Blek"
          onGameOver={() => onGameOver('blek')}
        />
      </Route>
      <Route path='/profile/edge'>
        <UnityLoader
          buildName="Edge Web"
          gameName="Edge"
          onGameOver={() => onGameOver('edge')}
        />
      </Route>
      <Route path='/profile/unpossible'>
        <UnityLoader
          buildName="Build"
          gameName="Unpossible"
          onGameOver={() => onGameOver('unpossible')}
        />
      </Route>
      <Route path='/profile/questions'>
        <QuestionsPanel
          onQuestionsSubmitted={() => onQuestionsCompleted()}
        />
      </Route>
    </div>
  );
};

const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if(!token) return false;

  const decoded = jwt_decode(token) as any;
  const current_time = new Date().getTime() / 1000;
  if (current_time > decoded.exp) { 
  /* expired */ 
    return false;
  }
  return true;
};