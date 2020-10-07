import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ProjectList from '../components/ProjectList';

const UserProjects = () => {
  const [loadedProjects, setLoadedProjects] = useState();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/user/${userId}`,
          {
            method: 'GET',
          }
        );

        const responseData = await response.json();
        setLoadedProjects(responseData.projects);
        if (!response.ok) {
          throw new Error(responseData.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProjects();
  }, [userId]);

  const projectDeleteHandler = (deletedProjectId) => {
    setLoadedProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== deletedProjectId)
    );
  };

  return (
    <React.Fragment>
      {loadedProjects && (
        <ProjectList
          items={loadedProjects}
          onDeleteProject={projectDeleteHandler}
        />
      )}
    </React.Fragment>
  );
};

export default UserProjects;
