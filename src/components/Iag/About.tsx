import React from 'react';
import { Message} from 'semantic-ui-react';
import { Helmet } from 'react-helmet';

const information = [
  'Mingxiao Guo: Doble Grado Ingeniería Informática y Matemáticas',
  'Pablo Gutiérrez: Doble Grado Ingeniería Informática y Matemáticas',
  'Alejandro Ortega: Grado en Desarrollo de Videojuegos',
  'Correo general de contacto para los tres: tfgfdi27@gmail.com'
]

export const About: React.FC = () => {

  return(
  <div>
    <Helmet>
      <title>Juegos TFG | About</title>
    </Helmet>

    <Message
        icon='gamepad' size='big'
        header='Portal de juegos para la medida de la inteligencia'
        content='Bienvenidos. En esta página encontraréis una serie de juegos desarrollados por alumnos de la facultad de informática de la
        UCM como parte de un TFG sobre el estudio de la inteligencia por medio de videojuegos. 
        Ante cualquier duda, problema técnico, o cuestión que quieras plantearnos, incluyendo feedback para mejorar la aplicación,
        por favor, no dudes en ponerte en contacto con nosotros usando la información listada más abajo.'
    />

    <Message>
        <Message.Header>Información de contacto de los desarrolladores</Message.Header>
        <Message.List items={information}/>
    </Message>
  </div>
  );
}
