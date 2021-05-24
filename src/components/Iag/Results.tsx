import React, { useEffect, useState } from 'react';
import { Message } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import { FLASK_URL } from '../../constants/apiConstants';

interface ResultsProps {
  userId: string;
};

export const Results: React.FC<ResultsProps> = ({ userId }) => {

  const [blekResult, setBlekResult] = useState<number[]>([]);
  const [edgeResult, setEdgeResult] = useState<{ maxLevels: number[], totalCheckpoints: number[] }>(
    { maxLevels: [], totalCheckpoints: [] }
  );
  const [unpossibleResult, setUnpossibleResult] = useState<number[]>([]);

  useEffect(() => {
    getBlekResults()
      .then(res => setBlekResult(res));

    getEdgeResults()
      .then(res => setEdgeResult(res));

    getUnpossibleResuls()
      .then(res => setUnpossibleResult(res));
  }, []);

  const getUnpossibleResuls = (): Promise<number[]> => {
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
  };
  const getBlekResults = (): Promise<number[]> => {
    return fetch(FLASK_URL + `blek/${userId}`, {
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
  };

  const getEdgeResults = (): Promise<{ maxLevels: number[], totalCheckpoints: number[] }> => {
    return fetch(FLASK_URL + `edge/${userId}`, {
      method: "GET",
      /*credentials : 'include',*/
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => (data.maxLevels && data.totalCheckpoints) ?
        { ...data } :
        { maxLevels: [], totalCheckpoints: [] }
      )
      .catch(e => {
        console.log(e);
        return { maxLevels: [], totalCheckpoints: [] };
      });
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
              Número de niveles completados en Blek (Minuto 5): {blekResult[0]}.
            </Message.Item>)
            :
            (<Message.Item>
              Todavía no hay resultados para Blek.
            </Message.Item>)
          }

          {edgeResult.maxLevels.length > 0 ?
            (<><Message.Item>
              Número de niveles completados en Edge (Minuto 6): {edgeResult.maxLevels[0]}.
            </Message.Item>
              <Message.Item>
                Número de checkpoints completados en Edge (Minuto 6): {edgeResult.totalCheckpoints[0]}.
            </Message.Item></>
            )
            :
            (<Message.Item>
              Todavía no hay resultados para Edge.
            </Message.Item>)
          }

          {unpossibleResult.length > 0 ?
            (<Message.Item>
              Número de intentos realizados en Unpossible (Minuto 5): {unpossibleResult[0]}.
            </Message.Item>)
            :
            (<Message.Item>
              Todavía no hay resultados para Unpossible.
            </Message.Item>)
          }

          {blekResult.length == 0 && unpossibleResult.length == 0 && edgeResult.maxLevels.length == 0 &&
            <Message.Item>
              Parece que todavía no has completado ningún juego. Cuando llegues al final de alguno de ellos, podrás encontrar aquí tus resultados.
            </Message.Item>
          }
        </Message.List>
      </Message>
    </div>
  );
}
