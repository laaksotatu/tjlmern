import React from 'react';
import { Link } from 'react-router-dom';

import './UserSingle.css';

const UserSingle = (props) => {
  return (
    <li>
      <div className='userSingle'>
        <Link to={`/${props.id}/projects`}>
          <h3>{props.name}</h3>
          <h4>
            {props.projects} {props.projects === 1 ? ' Project' : ' Projects'}
          </h4>
        </Link>
      </div>
    </li>
  );
};

export default UserSingle;
