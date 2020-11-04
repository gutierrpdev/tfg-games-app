import React from 'react';
import { Grid, Image, Button, Message } from 'semantic-ui-react';
import './styles.css';

interface GamesPanelProps {
  blekCompleted: boolean;
  edgeCompleted: boolean;
  unpossibleCompleted: boolean;
  onGameSelect: (gameName: string) => void;
}

export const GamesPanel: React.FC<GamesPanelProps> =
  ({ blekCompleted, edgeCompleted, unpossibleCompleted, onGameSelect }) => {
    const information = [
      'Pulsa sobre "Empezar Juego!" bajo cada imagen para lanzarlo en tu navegador.',
      'Una vez abierto un juego, este debe ser completado "del tirón", evitando salir del mismo durante la partida. Cada actividad no debería llevar más de 15 minutos en ser completada.',
      'Al principio de cada juego aparecerá una sección de tutorial para familiarizarte con las mecánicas del mismo. Una vez terminado el tutorial, podrás continuar con el juego en sí y tendrás un tiempo límite para completar todos los niveles que puedas. Se registrarán datos relativos a tu interacción con el juego.'
    ];
    return (
      <div>
        <Message
          icon='gamepad' size='big'
          header='Portal de juegos TFG'
          content='Bienvenidos. En esta página encontraréis una serie de juegos desarrollados por alumnos de la facultad de informática de la
        UCM como parte de un TFG sobre el estudio de la inteligencia por medio de videojuegos.'
        />

        <Message
          icon='exclamation circle' size='large'
          header='Compatibilidad de los juegos'
          content='Esta plataforma está diseñada para ser usada desde un navegador web de PC (sólo Chrome, Edge o Firefox). ¡Los juegos no funcionarán si tratas de acceder desde un dispositivo móvil!'
        />

        <Message>
          <Message.Header>Instrucciones e Indicaciones</Message.Header>
          <Message.List items={information} />
        </Message>

        <Grid celled centered columns={3}>
          <Grid.Column attached>
            <Image src='/img/edge.jpg' size='large' rounded centered />
            <Button onClick={() => onGameSelect('edge')}
              attached='bottom'
              color={edgeCompleted ? 'green' : 'blue'}
            >
              {edgeCompleted ? 'Completado' : 'Empezar juego!'}
            </Button>
          </Grid.Column>
          <Grid.Column attached>
            <Image src='/img/blek.jpg' size='large' rounded centered />
            <Button onClick={() => onGameSelect('blek')}
              attached='bottom'
              color={blekCompleted ? 'green' : 'blue'}
            >
              {blekCompleted ? 'Completado' : 'Empezar juego!'}
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Image src='/img/unpossible.png' size='large' rounded centered />
            <Button onClick={() => onGameSelect('unpossible')}
              attached='bottom'
              color={unpossibleCompleted ? 'green' : 'blue'}
            >
              {unpossibleCompleted ? 'Completado' : 'Empezar juego!'}
            </Button>
          </Grid.Column>
        </Grid>
      </div>
    );

  }