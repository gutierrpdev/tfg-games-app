import React, { useState } from 'react';
import { Form, Message, Grid, Image, Button, Checkbox, CheckboxProps, ButtonProps } from 'semantic-ui-react'
import {API_BASE_URL} from '../../constants/apiConstants';

interface QuestionsPanelProps {
  onQuestionsSubmitted: () => void;
};

export const QuestionsPanel: React.FC<QuestionsPanelProps> = ({ onQuestionsSubmitted }) => {
  const [knowsBlek, setKnowsBlek] = useState<number>(0);
  const [knowsEdge, setKnowsEdge] = useState<number>(0);
  const [knowsUnpossible, setKnowsUnpossible] = useState<number>(0);

  const values = [0, 1, 2, 3, 4, 5, 6, 7];

  function handleChange(e: React.FormEvent<HTMLInputElement>, data: CheckboxProps) {
    switch(data.name){
      case 'knowsBlek': setKnowsBlek(data.value as number); break;
      case 'knowsEdge': setKnowsEdge(data.value as number); break;
      case 'knowsUnpossible': setKnowsUnpossible(data.value as number); break;
    }
  }

  function sendForm(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps){
    e.preventDefault();
    
    const body = {
      payload: {knowsBlek, knowsEdge, knowsUnpossible, questionsCompleted: true},
      token: localStorage.getItem('token')
    };

    // TODO: move to api
    fetch(API_BASE_URL + 'users/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
      /*credentials: 'include',*/
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      onQuestionsSubmitted();
    })
    .catch(err => {
      console.log(err);
    });
  } 

  return(
    <div>
      <Message
        icon='question circle outline' size='large'
        header='Preguntas Iniciales'
      />

      <Grid celled centered columns={3}>
        <Grid.Column attached>
          <Image src='/img/edge.jpg' size="large" rounded centered/>
          <label>Valora tu nivel de experiencia con EDGE:</label>
          <Form.Group inline>
            {
              values.map(val => 
                <Form.Field key={val}>
                  <Checkbox
                    radio
                    label={val}
                    name='knowsEdge'
                    value={val}
                    checked={knowsEdge === val}
                    onChange={handleChange}
                  />
                </Form.Field>
              )
            }
          </Form.Group>
        </Grid.Column>
        <Grid.Column attached>
          <Image src='/img/blek.jpg' size="large" rounded centered/>
          <label>Valora tu nivel de experiencia con BLEK:</label>
          <Form.Group inline>
            {
              values.map(val => 
                <Form.Field key={val}>
                  <Checkbox
                    radio
                    label={val}
                    name='knowsBlek'
                    value={val}
                    checked={knowsBlek === val}
                    onChange={handleChange}
                  />
                </Form.Field>
              )
            }
          </Form.Group>
        </Grid.Column>
        <Grid.Column attached>
          <Image src='/img/unpossible.png' size="large" rounded centered/>
          <label>Valora tu nivel de experiencia con UNPOSSIBLE:</label>
          <Form.Group inline>
            {
              values.map(val => 
                <Form.Field key={val}>
                  <Checkbox
                    radio
                    label={val}
                    name='knowsUnpossible'
                    value={val}
                    checked={knowsUnpossible === val}
                    onChange={handleChange}
                  />
                </Form.Field>
              )
            }
          </Form.Group>
        </Grid.Column>
        <Button 
          attached='bottom' 
          onClick={sendForm} 
          color='blue'>
            Enviar
        </Button>
      </Grid>
    </div>
  );
}