import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../context/authContext';
import './NavLinks.css';

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className='navLinks'>
      <li>
        <NavLink to='/users/all' exact>
          USERS
        </NavLink>
      </li>
      <li>
        <NavLink to='/projects/all' exact>
          PROJECTS
        </NavLink>
      </li>
      {auth.token && (
        <li>
          <NavLink to={`/${auth.userId}/projects`}>MY PROJECTS</NavLink>
        </li>
      )}
      {auth.token && (
        <li>
          <NavLink to='/projects/new'>ADD PROJECT</NavLink>
        </li>
      )}
      {!auth.token && (
        <li>
          <NavLink to='/login'>LOG IN</NavLink>
        </li>
      )}
      {auth.token && (
        <li>
          <button className='logout_btn' onClick={auth.logout}>
            LOGOUT
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
