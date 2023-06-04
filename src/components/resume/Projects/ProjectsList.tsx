import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined } from '@fortawesome/free-solid-svg-icons';

import {Project, IProject} from './Project';
import { sortByKey } from '../common';

import styles from './Project.module.scss';
import { compCreate, compDelete } from '../common/api-helpers';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';

const URL_PATH = 'projects';

export function ProjectsList({ data,
                               editModeEnabled, 
                               key=0,
                               forExport=false,
                               sectionName='projects',
                               sectionOrder=0,
                               sectionVisibility=true,
                               handleSectionVisibility=() => {}, 
                               handleSectionOrder=() => {} }: IExperienceListProps) {
  let experiences = data;
  const [projects, setProjects] = useState<IProject[]>(sortByKey(experiences, 'startDate', true));
  const visibilityState = useState(sectionVisibility);
  const orderingState = useState(sectionOrder);

  useEffect(() => {
    handleSectionVisibility(sectionName, visibilityState[0]);
  }, [visibilityState[0]]);

  useEffect(() => {
    handleSectionOrder(sectionName, orderingState[0]);
  }, [orderingState[0]]);

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
    editModeEnabled: editModeEnabled,
    visibilityState: visibilityState,
    orderingState: orderingState,
    faIcon: faRulerCombined,
    sectionTitle: 'Projects'
  }

  return (
    <List key={key} {...expListProps}>

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