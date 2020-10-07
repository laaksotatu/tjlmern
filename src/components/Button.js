import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

const Button = (props) => {
  if (props.href) {
    return (
      <a href={props.href} className='button_default'>
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link to={props.to} exact={props.exact} className='button_default'>
        {props.children}
      </Link>
    );
  }
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      className='button_default'
    >
      {props.children}
    </button>
  );
};

export default Button;
