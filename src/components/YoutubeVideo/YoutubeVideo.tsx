import React from 'react';
import Youtube from 'react-youtube';
import {Button, Header} from 'semantic-ui-react';

interface YoutubeVideoProps {
  onVideoEnd: () => void;
  videoId: string; //N5pWe61TzPA
}

export const YoutubeVideo: React.FC<YoutubeVideoProps> = ({ onVideoEnd, videoId }) => {

  const opts = {
    height: '450',
    width: '800',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1 as (0 | 1 | undefined),
    },
  };

  function handleNextButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
    e.preventDefault();
    onVideoEnd();
  }
  
  return (
    <div className="ui one column stackable center aligned page grid">
      <div className="column twelve wide">
        <Header as='h1'>Vídeo Explicativo del Juego</Header>
        <Youtube 
          videoId={videoId}
          opts={opts}
          onEnd={onVideoEnd}/>
        <Button content='Empezar Juego!' onClick={handleNextButton} primary/>
      </div>
    </div>
  );
}