import React, { useState } from 'react';

import { Message, Form, Dropdown, Button, InputOnChangeData, DropdownProps } from 'semantic-ui-react';
import { API_BASE_URL } from '../../constants/apiConstants';

interface RegisterState {
  username_reg: string;
  password_reg: string;
  confirm_pass: string;
  age_reg: string;
  gender_reg: string;
  error_reg: string;
  reg_loading: boolean;
};

const defaultRegisterState: RegisterState = {
  username_reg: '',
  password_reg: '',
  confirm_pass: '',
  age_reg: '',
  gender_reg: '',
  error_reg: '',
  reg_loading: false
};

interface RegisterPayload {
  userId: string;
  password: string;
  age: number;
  gender: string;
};

interface RegisterPanelProps {
  onRegisterComplete: (userData: any) => void;
}

export const RegisterPanel: React.FC<RegisterPanelProps> = ({ onRegisterComplete }) => {

  const [regState, setRegState] = useState<RegisterState>(defaultRegisterState);

  function onSubmitRegister(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    // show error message if no username or password are provided.
    if (regState.username_reg.length < 1
      || regState.password_reg.length < 1
      || regState.age_reg.length < 1) {
      return setRegState(prevState => (
        { ...prevState, error_reg: 'Please fill in all required fields' })
      );
    }

    // check if password matches confirm password
    if (regState.password_reg !== regState.confirm_pass) {
      return setRegState(prevState => (
        { ...prevState, error_reg: 'Passwords do not match' })
      );
    }

    // parse age
    let age = parseInt(regState.age_reg, 10);
    if (age < 14 || age > 120) {
      return setRegState(prevState => (
        { ...prevState, error_reg: 'Age must be a valid number!' })
      );
    }

    setRegState(prevState => (
      { ...prevState, reg_loading: true })
    );

    const payload: RegisterPayload = {
      userId: regState.username_reg,
      password: regState.password_reg,
      age,
      gender: regState.gender_reg,
    };

    setRegState(prevState => (
      { ...prevState, error_reg: '' })
    );

    fetch(API_BASE_URL + 'users', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      },
      /*credentials: 'include'*/
    })
      .then(function (response) {
        if (response.status === 201) {
          return response.json();
        }
        else {
          return setRegState(prevState => ({
            ...prevState,
            error_reg: "Username already in use or incomplete field.",
            reg_loading: false
          }));
        }
      })
      .then(data => onRegisterComplete(data))
      .catch(function (error) {
        return setRegState(prevState => ({
          ...prevState,
          error_reg: "Username already in use or incomplete field.",
          reg_loading: false
        }));
      });
  }

  function handleRegisterChange(e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) {
    if (data.name in regState) {
      setRegState(prevState => ({
        ...prevState, [data.name]: data.value
      }));
    }
  }

  function handleGenderChange(e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
    setRegState(prevState => ({
      ...prevState, [data.name]: data.value
    }));
  }

  return (
    <div>
      {(regState.error_reg) &&
        <Message negative>
          <p>{regState.error_reg}</p>
        </Message>
      }

      <Form loading={regState.reg_loading}>
        <Form.Input
          icon='user'
          iconPosition='left'
          label='Nombre de Usuario'
          placeholder='Nombre de usuario...'
          name='username_reg'
          onChange={handleRegisterChange}
          required
        />
        <Form.Input
          icon='lock'
          iconPosition='left'
          label='Contraseña'
          placeholder='Contraseña...'
          type='password'
          name='password_reg'
          onChange={handleRegisterChange}
          required
        />
        <Form.Input
          icon='lock'
          iconPosition='left'
          label='Confirmar Contraseña'
          placeholder='Confirmar contraseña...'
          type='password'
          name='confirm_pass'
          onChange={handleRegisterChange}
          required
        />

        <Form.Input
          icon='address book'
          iconPosition='left'
          label='Edad'
          placeholder='Edad...'
          name='age_reg'
          onChange={handleRegisterChange}
          required
        />

        <Form.Input
          label='Género'
          placeholder='Género...'
          required
        >
          <Dropdown
            icon='venus mars'
            labeled
            button
            onChange={handleGenderChange}
            name='gender_reg'
            className='icon'
            selection
            options={[
              { key: 1, text: "Prefiero no indicarlo", value: "RatherNotSay" },
              { key: 2, text: "Varón", value: "Male" },
              { key: 3, text: "Mujer", value: "Female" },
              { key: 4, text: "Otro", value: "Other" }
            ]}
          />
        </Form.Input>

        <Button content='Registrarse!' primary onClick={onSubmitRegister} />
      </Form>
    </div>
  );
}