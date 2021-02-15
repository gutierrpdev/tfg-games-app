import React, { useEffect, useState } from 'react';
import { Message } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import { FLASK_URL } from '../../constants/apiConstants';

interface ResultsProps {
  userId: string;
};

export const Results: React.FC<ResultsProps> = ({ userId }) => {

  const [blekResult, setBlekResult] = useState<number[]>([]);
  const [edgeResult, setEdgeResult] = useState<number[]>([]);
  const [unpossibleResult, setUnpossibleResult] = useState<number[]>([]);

  useEffect(() => {
    getResuls('blek')
    .then(res => setBlekResult(res));

    getResuls('edge')
    .then(res => setEdgeResult(res));

    getResuls('unpossible')
    .then(res => setUnpossibleResult(res));
  }, []);

  const getResuls = (gameName: string): Promise<number[]> => {
    if (gameName === 'unpossible') {
      return fetch(FLASK_URL + `unpossible/${userId}`, {
        method: "GET",
        /*credentials : 'include',*/
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => data.numTries ? data.numTries as number[] : [])
      .catch(e => {
        console.log(e);
        return [];
      });
    }
    else {
      return fetch(FLASK_URL + `${gameName}/${userId}`, {
        method: "GET",
        /*credentials : 'include',*/
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => data.maxLevels ? data.maxLevels as number[] : [])
      .catch(e => {
        console.log(e);
        return [];
      });
    }
  };

  return (
    <div>
      <Helmet>
        <title>Juegos TFG | Resultados</title>
      </Helmet>

      <Message
        icon='calculator' size='big'
        header='Resultados obtenidos en los juegos'
        content='Aquí podrás consultar los resultados que hayas obtenido en cada uno de los juegos de la plataforma'
      />

      <Message>
        <Message.Header>Informe de Resultados</Message.Header>
        <Message.List>
          {blekResult.length > 0 ?
            (<Message.Item>
              Número de niveles completados en Blek: {blekResult[0]}.
            </Message.Item>)
            :
            (<Message.Item>
              Todavía no hay resultados para Blek.
            </Message.Item>)
          }

          {edgeResult.length > 0 ?
            (<Message.Item>
              Número de niveles completados en Edge: {edgeResult[0]}.
            </Message.Item>)
            :
            (<Message.Item>
              Todavía no hay resultados para Edge.
            </Message.Item>)
          }

          {unpossibleResult.length > 0 ?
            (<Message.Item>
              Número de intentos realizados en Unpossible: {unpossibleResult[0]}.
            </Message.Item>)
            :
            (<Message.Item>
              Todavía no hay resultados para Unpossible.
            </Message.Item>)
          }

          {blekResult.length == 0 && unpossibleResult.length == 0 && edgeResult.length == 0 &&
            <Message.Item>
              Parece que todavía no has completado ningún juego. Cuando llegues al final de alguno de ellos, podrás encontrar aquí tus resultados.
            </Message.Item>
          }
        </Message.List>
      </Message>
    </div>
  );
}
