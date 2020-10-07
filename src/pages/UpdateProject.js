import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../components/Input';
import Button from '../components/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../utility/validators';
import { useForm } from '../custom-hooks/FormHook';
import { AuthContext } from '../context/authContext';

const UpdateProject = () => {
  const auth = useContext(AuthContext);
  const [loadedProject, setLoadedProject] = useState();
  const projectId = useParams().projectId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/${projectId}`,
          {
            method: 'GET',
          }
        );

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setFormData(
          {
            title: {
              value: responseData.project.title,
              isValid: true,
            },
            description: {
              value: responseData.project.description,
              isValid: true,
            },
          },
          true
        );
        setLoadedProject(responseData.project);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProject();
  }, [projectId, setFormData]);

  const projectUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token,
        },
        body: JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
      });

      history.push('/' + auth.userId + '/projects');
    } catch (err) {
      console.log(err);
    }
  };

  if (!loadedProject) {
    // style in button.css
    return <div class='loader'></div>;
  }

  return (
    <React.Fragment>
      {loadedProject && (
        <form onSubmit={projectUpdateSubmitHandler}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Invalid input'
            onInput={inputHandler}
            originalValue={loadedProject.title}
            originalValid={true}
          />
          <Input
            id='description'
            element='textarea'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Invalid input'
            onInput={inputHandler}
            originalValue={loadedProject.description}
            originalValid={true}
          />
          <Button type='submit' disabled={!formState.isValid}>
            UPDATE PROJECT
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateProject;
