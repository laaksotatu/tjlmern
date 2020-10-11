import React, { useState, useContext, useEffect, useCallback } from 'react';
import {useFormik} from 'formik'
import * as Yup from 'yup';

import Button from '../components/Button';
import '../styles/formStyle.css';
import { AuthContext } from '../context/authContext';

const LogIn = () => {
  const auth = useContext(AuthContext);
  const [loginMode, setLoginMode] = useState(true);
  const [error, setError] = useState();
  const [overallValidity, setOverallValidity] =useState(false);

  const initialValues = {
    name: '',
    email: '',
    password: ''
  }

  

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().required('Required').email('Invalid email'),
    password: Yup.string().required('Required').min(5, 'Too Short!')
  })

  const formik =  useFormik({
    initialValues,
    validationSchema,
  })

  const validityCheck =useCallback(() => {

    if(loginMode && formik.errors.email === undefined && formik.errors.password === undefined && (formik.touched.email === true  || formik.touched.password === true)){
      setOverallValidity(true);
    }

    if(loginMode && (formik.errors.email || formik.errors.password)){
      setOverallValidity(false);
    }

    if(!loginMode && formik.errors.email === undefined && formik.errors.password === undefined && formik.errors.name === undefined && (formik.touched.email === true  || formik.touched.password === true || formik.touched.name === true)){
      setOverallValidity(true);
    }
    if(!loginMode && (formik.errors.email || formik.errors.password || formik.errors.name)){
      setOverallValidity(false);
    }
    
  }, [formik.errors.email, formik.errors.name, formik.errors.password, formik.touched.email, formik.touched.name, formik.touched.password,loginMode])






  useEffect(() => {

    validityCheck()   

  }, [ loginMode, formik.errors,validityCheck])



  const switchModeHandler = () => {
    if (!loginMode) {
    console.log('swap su')
    setOverallValidity(false)
    } else {
    console.log('swap lo')
    
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
            email: formik.values.email,
            password: formik.values.password,
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
            name: formik.values.name,
            email: formik.values.email,
            password: formik.values.password,
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
      <div className="login-box">
      <form onSubmit={authSubmitHandler}>
        {!loginMode && (
          <React.Fragment>
            <div>
          <label htmlFor="name">name</label>
          <input 
            id='name'
            type='text'
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          </div>
          {formik.errors.name && formik.touched.name && <p>{formik.errors.name}</p>}
          
          </React.Fragment>
        )}
        <div>
        <label htmlFor="email">email</label>
        <input 
          id='email'
          type='email'
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        </div>
        {formik.errors.email && formik.touched.email && <p>{formik.errors.email}</p>}

        <div>
        <label htmlFor="password">password</label>
        <input
          id='password'
          type='password'
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        </div>
        {formik.errors.password && formik.touched.password && <p>{formik.errors.password}</p>}
        <div>
        <Button type='submit' disabled={!overallValidity}>
          {loginMode ? 'LOGIN' : 'SIGNUP'}
        </Button>
        </div>
      </form>
      
      <Button onClick={switchModeHandler}>
        SWAP TO {loginMode ? 'SIGNUP' : 'LOGIN'}
      </Button>
      
      {error && <h4>{`${error}`}</h4>}
      </div>
    </React.Fragment>
  );
};

export default LogIn;
