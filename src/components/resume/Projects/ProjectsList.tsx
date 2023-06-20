import React, { useState } from 'react';

import { faRulerCombined } from '@fortawesome/free-solid-svg-icons';

import {Project, IProject} from './Project';
import { ICommonResumeSectionProps } from '../common';

import styles from './Project.module.scss';
import { compCreate, compDelete, compUpdate } from '../common/api-helpers';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';

import { CommonSection } from '../common/Section';
import { sortByEndDate } from '../Experience/common';

export const ProjectsSection = (props: ICommonResumeSectionProps) => {
    return (
        <CommonSection {...props} styles={styles} faIcon={faRulerCombined} sectionTitle={'Projects'}/>
    );
}

const URL_PATH = 'projects';

export function ProjectsList({ data,
                               editModeEnabled, 
                               sectionVisible,
                               forExport=false,
                               shortVersion=false }: IExperienceListProps) {
  let experiences = data;
  const [projects, setProjects] = useState<IProject[]>(sortByEndDate(experiences));

  const handleUpdateProject = (updatedExperience: IProject) => {
    setProjects((prevExperiences: IProject[]) =>
      sortByEndDate(prevExperiences.map((experience: IProject) =>
          experience._id === updatedExperience._id ? updatedExperience : experience
        ))
    );
    compUpdate(URL_PATH, updatedExperience, updatedExperience._id);
  };

  const handleDeleteProject = (experienceId: number) => {
    compDelete(URL_PATH, experienceId, (_response) => {
      setProjects((experiences: IProject[]) => 
        experiences.filter( el => el._id !== experienceId )
      );
    })
  };

  const handleAddProject = () => {
    let experience: IProject = {
      title: 'Project',
      websites: [{name: 'Project Webiste', link: 'http://project.com'}],
      description: 'Add your description here',
      isVisible: false,
      startDate: new Date().getTime(),
      endDate: new Date().getTime()
    }
    compCreate(URL_PATH, experience, (response) => setProjects([...projects, response.data]));
  };

  const expListProps: IExpListProps = {
    styles: styles,
    sectionVisible: sectionVisible,
    forExport: forExport,
    singlePage: shortVersion
  }

  return (
    <List {...expListProps}>

      {projects.map((experience: IProject, index: number) => (
        <Project
          key={experience._id}
          project={experience}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
          editModeEnabled={editModeEnabled}
          isLast={index === projects.length - 1}
          forExport={forExport}
          shortVersion={shortVersion}
        />
      ))}

      <AddNew
        editModeEnabled={editModeEnabled}
        handleAddExperience={handleAddProject}
        styles={styles}
      />
    </List>
  );
}