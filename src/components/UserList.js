import React from 'react';

import UserSingle from './UserSingle';
import './UserList.css';

const UserList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className='center'>
        <h1>No users found</h1>
      </div>
    );
  }

  return (
    <ul className='uList'>
      {props.items.map((user) => {
        return (
          <UserSingle
            key={user.id}
            id={user.id}
            name={user.name}
            projects={user.projects.length}
          />
        );
      })}
    </ul>
  );
};

export default UserList;
