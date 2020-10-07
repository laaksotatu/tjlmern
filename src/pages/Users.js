import React, { useEffect, useState } from 'react';

import UserList from '../components/UserList';

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const userRequestIife = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/all');

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setLoadedUsers(responseData.users);
      } catch (err) {
        console.log(err);
      }
    };
    userRequestIife();
  }, []);

  return (
    <React.Fragment>
      {loadedUsers && <UserList items={loadedUsers} />};
    </React.Fragment>
  );
};

export default Users;
