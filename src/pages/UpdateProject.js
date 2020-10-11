import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {useFormik} from 'formik'
import * as Yup from 'yup';

import Button from '../components/Button';
import { AuthContext } from '../context/authContext';

const UpdateProject = () => {
  const auth = useContext(AuthContext);
  const [loadedProject, setLoadedProject] = useState();
  const projectId = useParams().projectId;
  const history = useHistory();
  const [overallValidity, setOverallValidity] =useState(true);


  const initialValues = {
    title:  '' ,
    description:   '' 
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
    if(formik.errors.title === undefined && formik.errors.description === undefined){
     setOverallValidity(true);
   }

   if(formik.errors.title || formik.errors.description ){
     setOverallValidity(false);
   }
   
 },[formik.errors.description, formik.errors.title])

 useEffect(() => {

   validityCheck()   

 }, [formik.errors,validityCheck])

 const setData = () => {
  formik.setFieldValue("title", loadedProject.title)
  formik.setFieldValue('description', loadedProject.description)
  
};
  

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

      setLoadedProject(responseData.project);

      
      setOverallValidity(true);


       

    } catch (err) {
      console.log(err);
    }
  };
  fetchProject();
  
}, [projectId ]);



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
          title: formik.values.title,
          description: formik.values.description,
        }),
      });

      history.push('/' + auth.userId + '/projects');
    } catch (err) {
      console.log(err);
    }
  };

  



  if (!loadedProject) {
    // style in button.css
    return <div className='loader'></div>;
  } 

  if(loadedProject && formik.values.title === '' && formik.values.title === '') {
    setData();
    setOverallValidity(true);
  }
  

  return (
    <React.Fragment>
      {loadedProject && (
        <form onSubmit={projectUpdateSubmitHandler}>
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
          UPDATE PROJECT
        </Button>
        </div>
      </form>
      )}
    </React.Fragment>
  );
};

export default UpdateProject;
