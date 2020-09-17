import React, { useState } from 'react';
import Unity, { UnityContent } from "react-unity-webgl";
import { API_BASE_URL } from '../../constants/apiConstants';
import { Progress, Container } from 'semantic-ui-react';

interface GameEvent {
  timestamp: number;
  userId: string;
  gameName: string;
  name: string;
  orderInSequence: number;
  parameters: Array<{name: string, value: string}>;
};

interface UnityLoaderProps {
  gameName: string;
  buildName: string
  onGameOver: () => void;
}

export const UnityLoader: React.FC<UnityLoaderProps> = ({ gameName, buildName, onGameOver }) => {
  const [progression, setProgression] = useState<number>(0);

  const unityContent = new UnityContent(
    `${process.env.PUBLIC_URL}/build/${gameName}/${buildName}.json`,
    `${process.env.PUBLIC_URL}/build/${gameName}/UnityLoader.js`,
  );

  unityContent.on("progress", (progress: number) => {
    setProgression(progress);
  });

  unityContent.on("LogEvent", (eventJSON: string) => {
    const event: GameEvent = JSON.parse(eventJSON);
    const body = {
      payload: event,
      token: localStorage.getItem('token')
    };

    fetch(API_BASE_URL + 'events', {
      method: 'POST',
      body: JSON.stringify(body), 
      /* credentials: 'include',*/ 
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => console.log(response))
    .catch(err => console.log(err));
  });

  unityContent.on("GameOver", () => {
    const payload = gameName === 
      'Blek' ? { blekCompleted: true }
      : (gameName === 'Edge' ? { edgeCompleted: true } 
      : { unpossibleCompleted: true });
    const body = {
      payload: payload,
      token: localStorage.getItem('token')
    };

    fetch(API_BASE_URL + 'users/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
      /* credentials: 'include', */
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(response);
      onGameOver();
    })
    .catch(err => {
      console.log(err);
    });
  });

  unityContent.setFullscreen(false);

  return (
    <div>
      {progression < 1 && (
      <Progress 
        percent={progression * 100}
        indicating={progression < 1}
        label={progression < 1? 'Cargando juego': 'Carga Completada!'}
        progress='percent'/>
      )}
      <Container height='auto'>
        <Unity unityContent={unityContent}/>
      </Container>
    </div>);
}