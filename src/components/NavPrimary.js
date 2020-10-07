import React from 'react';
import { Link } from 'react-router-dom';

import NavLinks from './NavLinks';

import './NavPrimary.css';

const NavPrimary = () => {
  return (
    <header className='navHeader '>
      <h1>
        <Link to='/projects/all'>Project Ideas</Link>
      </h1>
      <nav>
        <NavLinks />
      </nav>
    </header>
  );
};

export default NavPrimary;
