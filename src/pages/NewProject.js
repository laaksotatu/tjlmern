import React, { useContext, useState, useEffect, useCallback} from 'react';
import { useHistory } from 'react-router-dom';
import {useFormik} from 'formik'
import * as Yup from 'yup';

import '../styles/formStyle.css';
import Button from '../components/Button';
import { AuthContext } from '../context/authContext';

const NewProject = () => {
  const auth = useContext(AuthContext);
  const [overallValidity, setOverallValidity] =useState(false);

  const initialValues = {
    title: '',
    description: ''
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Required'),
    description: Yup.string().required('Required').min(10, 'Too Short!')
  })

  const formik =  useFormik({
    initialValues,
    validationSchema,
  })

  const validityCheck = useCallback(() => {
     if(formik.errors.title === undefined && formik.errors.description === undefined && (formik.touched.title === true  || formik.touched.description === true)){
      setOverallValidity(true);
    }

    if(formik.errors.title || formik.errors.description ){
      setOverallValidity(false);
    }
    
  },[formik.errors.description, formik.errors.title, formik.touched.description, formik.touched.title])

  useEffect(() => {

    validityCheck()   

  }, [formik.errors,validityCheck])


  const history = useHistory();

  const projectSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formik.values)
    try {
      const response = await fetch('http://localhost:5000/api/projects/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token,
        },
        body: JSON.stringify({
          title: formik.values.title,
          description: formik.values.description,
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
      <div className="inputBase">
      <label htmlFor="">Title</label>
      <input
        id='title'
        name="title"
        type='text'
        label='Title'
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.title}
      />
      <label htmlFor="">Description</label>
      <textarea
        rows="10"
        id='description'
        name="description"
        label='Description'
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.description}
      />
      <Button type='submit' disabled={!overallValidity} >
        CREATE PROJECT
      </Button>
      </div>
    </form>
  );
};

export default NewProject;
