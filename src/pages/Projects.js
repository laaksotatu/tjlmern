import React, { useEffect, useState } from 'react';

import ProjectList from '../components/ProjectList';

const Projects = () => {
  const [loadedProjects, setLoadedProjects] = useState();

  useEffect(() => {
    const sendRequest = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects/all');

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setLoadedProjects(responseData.projects);
      } catch (err) {
        console.log(err);
      }
    };
    sendRequest();
  }, []);

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
      ;
    </React.Fragment>
  );
};

export default Projects;
