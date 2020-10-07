import React, { useState, useContext } from 'react';

import Input from '../components/Input';
import Button from '../components/Button';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../utility/validators';
import { useForm } from '../custom-hooks/FormHook';
import { AuthContext } from '../context/authContext';

const LogIn = () => {
  const auth = useContext(AuthContext);
  const [loginMode, setLoginMode] = useState(true);
  const [error, setError] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!loginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
        },
        false
      );
    }
    setLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (loginMode) {
      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
        setError(err.message || 'An error has occured.');
      }
    } else {
      try {
        const response = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
        setError(err.message || 'An error has occured.');
      }
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={authSubmitHandler}>
        {!loginMode && (
          <Input
            element='input'
            id='name'
            type='text'
            label='Name'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Enter a name'
            onInput={inputHandler}
          />
        )}
        <Input
          element='input'
          id='email'
          type='email'
          label='email'
          validators={[VALIDATOR_EMAIL()]}
          errorText='Enter a valid email address'
          onInput={inputHandler}
        />
        <Input
          element='input'
          id='password'
          type='password'
          label='password'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Enter a valid password, min 5 characters'
          onInput={inputHandler}
        />
        <Button type='submit' disabled={!formState.isValid}>
          {loginMode ? 'LOGIN' : 'SIGNUP'}
        </Button>
      </form>
      <Button onClick={switchModeHandler}>
        SWAP TO {loginMode ? 'SIGNUP' : 'LOGIN'}
      </Button>
      {error && <h4>{`${error}`}</h4>}
    </React.Fragment>
  );
};

export default LogIn;
