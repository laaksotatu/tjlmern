import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../utility/validators';
import Input from '../components/Input';
import Button from '../components/Button';
import { useForm } from '../custom-hooks/FormHook';
import { AuthContext } from '../context/authContext';

const NewProject = () => {
  const auth = useContext(AuthContext);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const projectSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/projects/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token,
        },
        body: JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          author: auth.userId,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      history.push('/all');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={projectSubmitHandler}>
      <Input
        id='title'
        element='input'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Input not valid'
        onInput={inputHandler}
      />
      <Input
        id='description'
        element='textarea'
        label='Description'
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        errorText='Input not valid'
        onInput={inputHandler}
      />
      <Button type='submit' disabled={!formState.isValid}>
        CREATE PROJECT
      </Button>
    </form>
  );
};

export default NewProject;
