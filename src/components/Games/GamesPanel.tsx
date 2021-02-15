import React from 'react';
import { Grid, Image, Button, Message } from 'semantic-ui-react';
import './styles.css';

interface GamesPanelProps {
  blekCompleted: boolean;
  unpossibleCompleted: boolean;
  edgeCompleted: boolean;
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
        UCM como parte de un TFG sobre el estudio de las capacidades cognitivas por medio de videojuegos.'
        />

        <Message size='large' warning>
          <Message.Header>
          Compatibilidad de los juegos
          </Message.Header>
          Esta plataforma está diseñada para ser usada SÓLO desde los siguientes navegadores web de PC:
          <Message.List>
            <Message.Item>
              En Windows/ Linux: Microsoft Edge, Chrome, Firefox
            </Message.Item>
            <Message.Item>
              En Mac: únicamente Firefox
            </Message.Item>
          </Message.List>
          Los juegos no funcionarán adecuadamente desde dispositivos móviles.
        </Message>

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
              {edgeCompleted ? 'Completado' : '¡Empezar juego!'}
            </Button>
          </Grid.Column>
          <Grid.Column attached>
            <Image src='/img/blek.jpg' size='large' rounded centered />
            <Button onClick={() => onGameSelect('blek')}
              attached='bottom'
              color={blekCompleted ? 'green' : 'blue'}
            >
              {blekCompleted ? 'Completado' : '¡Empezar juego!'}
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Image src='/img/unpossible.png' size='large' rounded centered />
            <Button onClick={() => onGameSelect('unpossible')}
              attached='bottom'
              color={unpossibleCompleted ? 'green' : 'blue'}
            >
              {unpossibleCompleted ? 'Completado' : '¡Empezar juego!'}
            </Button>
          </Grid.Column>
        </Grid>
      </div>
    );

  }