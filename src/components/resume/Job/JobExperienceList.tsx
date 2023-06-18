import React, { useState } from 'react';

import { faSuitcase } from '@fortawesome/free-solid-svg-icons';

import {JobExperience, IJobExperience} from './JobExperience';
import { ICommonResumeSectionProps } from '../common';

import styles from './Job.module.scss';
import { compCreate, compDelete, compUpdate } from '../common/api-helpers';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';
import { CommonSection } from '../common/Section';
import { sortByEndDate } from '../Experience/common';

export const JobExperienceSection = ({ editModeEnabled, 
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
                       faIcon={faSuitcase}
                       sectionTitle={'Work Experience'}
                       editModeEnabled={editModeEnabled}/>
    );
}

const URL_PATH = 'jobExperience';

export function JobExperienceList({ data,
                                    editModeEnabled, 
                                    sectionVisible,
                                    forExport=false,
                                    shortVersion=false }: IExperienceListProps) {
  const [jobExperiences, setJobExperiences] = useState<IJobExperience[]>(sortByEndDate(data));

  const handleUpdateJobExperience = (updatedExperience: IJobExperience) => {
    setJobExperiences((prevExperiences: IJobExperience[]) =>
      sortByEndDate(prevExperiences.map((experience: IJobExperience) =>
          experience._id === updatedExperience._id ? updatedExperience : experience
        ))
    );
    compUpdate(URL_PATH, updatedExperience, updatedExperience._id);
  };

  const handleDeleteJobExperience = (experienceId: number) => {
    compDelete(URL_PATH, experienceId, (_response) => {
      setJobExperiences((experiences: IJobExperience[]) => 
        experiences.filter( el => el._id !== experienceId )
      );
    })
  };

  const handleAddJobExperience = () => {
    let experience: IJobExperience = {
      title: 'Position',
      place: 'Place',
      placeLink: 'http://place.com',
      placeLocation: 'Place Str. 7, Somewhere',
      description: 'Add your description here',
      isVisible: false,
      startDate: new Date().getTime(),
      endDate: new Date().getTime()
    }
    compCreate(URL_PATH, experience, (response) => setJobExperiences([...jobExperiences, response.data]));
  };

  const expListProps: IExpListProps = {
    styles: styles,
    sectionVisible: sectionVisible
  }

  return (
    <List {...expListProps}>

      {jobExperiences.map((experience: IJobExperience, index: number) => (
        <JobExperience
          key={experience._id}
          jobExperience={experience}
          onUpdate={handleUpdateJobExperience}
          onDelete={handleDeleteJobExperience}
          editModeEnabled={editModeEnabled}
          isLast={index === jobExperiences.length - 1}
          forExport={forExport}
          shortVersion={shortVersion}
        />
      ))}

      <AddNew
        editModeEnabled={editModeEnabled}
        handleAddExperience={handleAddJobExperience}
        styles={styles}
      />
    </List>
  );
}