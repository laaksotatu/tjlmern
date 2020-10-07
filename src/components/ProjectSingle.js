import React, { useContext } from 'react';

import './ProjectSingle.css';
import Button from './Button';
import { AuthContext } from '../context/authContext';

const ProjectSingle = (props) => {
  const auth = useContext(AuthContext);
  const deleteProject = async () => {
    try {
      await fetch(`http://localhost:5000/api/projects/${props.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: auth.token,
        },
      });
    } catch (err) {
      console.log(err);
    }
    props.onDelete(props.id);
  };

  return (
    <li className='projSingle'>
      <div>
        <h2>{props.title}</h2>
        <h4>{props.author}</h4>
        <p>{props.description}</p>
      </div>
      <div>
        {auth.userId === props.authorId && (
          <Button to={`/projects/${props.id}`}>EDIT</Button>
        )}

        {auth.userId === props.authorId && (
          <Button onClick={deleteProject}>DELETE</Button>
        )}
      </div>
    </li>
  );
};

export default ProjectSingle;
