import React from 'react';

import ProjectSingle from './ProjectSingle';

import './ProjectList.css';

const ProjectList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className='center'>
        <h2>This user has no projects.</h2>
      </div>
    );
  }

  return (
    <ul className='projList'>
      {props.items.map((project) => (
        <ProjectSingle
          key={project.id}
          id={project.id}
          title={project.title}
          description={project.description}
          authorId={project.author}
          onDelete={props.onDeleteProject}
        />
      ))}
    </ul>
  );
};

export default ProjectList;
