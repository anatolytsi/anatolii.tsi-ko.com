import React, { useState } from 'react';

import { faRulerCombined } from '@fortawesome/free-solid-svg-icons';

import {Project, IProject} from './Project';
import { ICommonResumeSectionProps, sortByKey } from '../common';

import styles from './Project.module.scss';
import { compCreate, compDelete } from '../common/api-helpers';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';

import { CommonSection } from '../common/Section';

export const ProjectsSection = ({ editModeEnabled, 
                                  sectionName,
                                  order,
                                  isVisible,
                                  orderSetter,
                                  visibilitySetter }: ICommonResumeSectionProps) => {
    return (
        <CommonSection styles={styles}
                       sectionName={sectionName}
                       order={order}
                       isVisible={isVisible}
                       orderSetter={orderSetter}
                       visibilitySetter={visibilitySetter}
                       faIcon={faRulerCombined}
                       sectionTitle={'Projects'}
                       editModeEnabled={editModeEnabled}/>
    );
}

const URL_PATH = 'projects';

export function ProjectsList({ data,
                               editModeEnabled, 
                               sectionVisible,
                               forExport=false, }: IExperienceListProps) {
  let experiences = data;
  const [projects, setProjects] = useState<IProject[]>(sortByKey(experiences, 'startDate', true));

  const handleUpdateProject = (updatedExperience: IProject) => {
    setProjects((prevExperiences: IProject[]) =>
      sortByKey(prevExperiences.map((experience: IProject) =>
          experience._id === updatedExperience._id ? updatedExperience : experience
        ), 'startDate', true)
    );
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
    sectionVisible: sectionVisible
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