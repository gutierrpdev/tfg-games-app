import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import { GamesPanel } from '../Games/GamesPanel';

import { QuestionsPanel } from '../Questions/QuestionsPanel';
import { API_BASE_URL } from '../../constants/apiConstants';
import { UnityLoader } from '../UnityLoader/UnityLoader';
import { YoutubeVideo } from '../YoutubeVideo/YoutubeVideo';
import { Route, useHistory, Link } from 'react-router-dom';

interface UserData {
  blekPlayed: boolean;
  edgePlayed: boolean;
  unpossiblePlayed: boolean;
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

  // Get user profile on first load.
  useEffect(() => {
    isLoggedIn() ? getProfile() : history.push('/login');
  }, []);

  function getProfile(){

    /*
    setUserData({
      blekPlayed: true,
      unpossiblePlayed: false,
      edgePlayed: true,
      questionsCompleted: true,
      userAge: 27,
      userId: 'test27',
      userGender: 'Male',
    });
    return;*/

    // TODO: Move to api.
    fetch(API_BASE_URL + 'users/me', {
      method:"GET",
      credentials : 'include',
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
    })
    .catch(e => {
      // Remove local session and return to login screen.
      localStorage.removeItem('iagSession');
      history.push('/login');
    });
  }

  // TODO: move to api
  function handleLogout() {
    fetch(API_BASE_URL + 'users/logout', {
      method:"POST",
      credentials : 'include'
    })
    .then((res) => {
      localStorage.removeItem('iagSession');
      history.push('/login');
    })
    .catch(err => {
      console.log(err);
    })
  }

  function onGameSelect(gameName: string){
    gameName === 'blek' ? history.push('/blek-video') : history.push('/' + gameName);
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
      {history.location.pathname !== '/questions' && (
        <Link to='/games'>
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

      <Route path='/games'>
        <GamesPanel 
          blekPlayed={userData.blekPlayed}
          unpossiblePlayed={userData.unpossiblePlayed}
          edgePlayed={userData.edgePlayed}
          onGameSelect={onGameSelect}
        />
      </Route>
      <Route path='/blek-video'>
        <YoutubeVideo
          videoId="N5pWe61TzPA"
          onVideoEnd={() => history.push('/blek')}
        />
      </Route>
      <Route path='/blek'>
        <UnityLoader
          buildName="BlekWeb"
          gameName="Blek"
          onGameOver={() => history.push('/games')}
        />
      </Route>
      <Route path='/edge'>
        <UnityLoader
          buildName="Edge Web"
          gameName="Edge"
          onGameOver={() => history.push('/games')}
        />
      </Route>
      <Route path='/unpossible'>
        <UnityLoader
          buildName="Build"
          gameName="Unpossible"
          onGameOver={() => history.push('/games')}
        />
      </Route>
      <Route path='/questions'>
        <QuestionsPanel
          onQuestionsSubmitted={() => history.push('/games')}
        />
      </Route>
    </div>
  );
};

const isLoggedIn = () => localStorage.getItem('iagSession') === 'ongoing';