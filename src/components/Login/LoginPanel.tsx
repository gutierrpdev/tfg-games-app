import React, { useState } from 'react';
import { Button, Form, Message, InputOnChangeData } from 'semantic-ui-react'

import { API_BASE_URL } from '../../constants/apiConstants';

interface LoginState {
  username_login: string;
  password_login: string;
  error_login: string;
  login_loading: boolean;
};

const defaultLoginState: LoginState = {
  username_login: '',
  password_login: '',
  error_login: '',
  login_loading: false,
};

interface LoginPayload {
  userId: string;
  password: string;
}

interface LoginPanelProps {
  onLoginComplete: (userData: any) => void;
}

export const LoginPanel: React.FC<LoginPanelProps> = ({ onLoginComplete }) => {

  const [loginState, setLoginState] = useState<LoginState>(defaultLoginState);

  function onSubmitLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    // show error message if no username or password are provided.
    if (loginState.username_login.length < 1 || loginState.password_login.length < 1) {
      setLoginState(prevState => (
        { ...prevState, error_login: 'Must include a valid username and password' })
      );
      return;
    }

    setLoginState(prevState => ({ ...prevState, login_loading: true }));

    const payload: LoginPayload = {
      userId: loginState.username_login,
      password: loginState.password_login,
    };

    // reset error state
    setLoginState(prevState => ({ ...prevState, error_login: '' }));

    fetch(API_BASE_URL + 'users/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      /*credentials: 'include',*/
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        if (response.status === 201) {
          setLoginState(prevState => ({ ...prevState, login_loading: false }));
          return response.json();
        }
        else {
          return setLoginState(prevState => ({
            ...prevState,
            error_login: 'Login failed',
            login_loading: false,
          }));
        }
      })
      .then(data => onLoginComplete(data))
      .catch(function (error) {
        console.log(error);
        return setLoginState(prevState => ({
          ...prevState,
          error_login: 'Login failed',
          login_loading: false,
        }));
      });
  }

  function handleLoginChange(e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) {
    if (data.name in loginState) {
      setLoginState(prevState => ({
        ...prevState, [data.name]: data.value
      }));
    }
  }

  return (
    <div>
      {(loginState.error_login.length >= 1) &&
        <Message negative>
          <p>{loginState.error_login}</p>
        </Message>
      }

      <Form loading={loginState.login_loading}>
        <Form.Input
          icon='user'
          iconPosition='left'
          label='Nombre de usuario'
          placeholder='Nombre de Usuario...'
          name='username_login'
          onChange={handleLoginChange}
          required
        />
        <Form.Input
          icon='lock'
          iconPosition='left'
          label='Contraseña'
          type='password'
          placeholder='Contraseña...'
          name='password_login'
          onChange={handleLoginChange}
          required
        />

        <Button content='Iniciar Sesión' primary onClick={onSubmitLogin} />
      </Form>
    </div>
  );
}