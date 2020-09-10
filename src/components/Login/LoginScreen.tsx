import React from 'react';
import { Divider, Grid, Segment, Header, Icon, Message } from 'semantic-ui-react'
import { Helmet } from 'react-helmet';
import './styles.css';

import { LoginPanel } from './LoginPanel';
import { RegisterPanel } from './RegisterPanel';
import { useHistory } from 'react-router-dom';

export const Login: React.FC = () => {
  
  let history = useHistory();
  
  // what to do when user completes login/register
  function onActionComplete() {
    localStorage.setItem('iagSession', 'ongoing');
    history.push('/');
  }

  if(isLoggedIn()){
    history.push('/');
  }
    
  return (
    <div className="login">
      <Helmet>
        <title>Intelligence Assessment Games | Login</title>
      </Helmet>

      <Header as='h2' icon textAlign='center'>
        <Icon name='chess' circular />
          <Header.Content>Juegos para la medida de la inteligencia</Header.Content>
      </Header>

      <Message
        icon='exclamation circle' size='large'
        header='Compatibilidad de los juegos'
        content='Esta plataforma está diseñada para ser usada desde un navegador web de PC (sólo Chrome, Edge o Firefox). ¡Los juegos no funcionarán si tratas de acceder desde un dispositivo móvil!'
      />

      <Segment placeholder className="login-body">
        <Grid columns={2} relaxed='very' stackable verticalAlign='middle' className="padded-login">        
        <Grid.Column >
          <LoginPanel onLoginComplete={onActionComplete}/>
        </Grid.Column>

        <Grid.Column>
          <RegisterPanel onRegisterComplete={onActionComplete}/>
        </Grid.Column>
      </Grid>

      <Divider vertical>Ó</Divider>
      </Segment>
    </div>
  );
}

const isLoggedIn = () => localStorage.getItem('iagSession') === 'ongoing';

export default Login;