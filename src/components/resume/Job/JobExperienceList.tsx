import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSuitcase } from '@fortawesome/free-solid-svg-icons';

import {JobExperience, IJobExperience} from './JobExperience';
import { AddExperience, ExperienceListProps } from '../Experience';
import { SectionControls, sortByKey } from '../common';

import styles from './Job.module.scss';
import { compCreate, compDelete } from '../common/api-helpers';

interface JobExperienceListProps extends ExperienceListProps {};

const URL_PATH = 'jobs';

export function JobExperienceList({ data,
                                    isAdmin, 
                                    key=0,
                                    forExport=false,
                                    sectionName='jobExperience',
                                    sectionOrder=0,
                                    sectionVisibility=true,
                                    handleSectionVisibility=() => {}, 
                                    handleSectionOrder=() => {} }: JobExperienceListProps) {
  let experiences = data;
  const [jobExperiences, setJobExperiences] = useState<IJobExperience[]>(sortByKey(experiences, 'startDate', true));
  const visibilityState = useState(sectionVisibility);
  const orderingState = useState(sectionOrder);

  useEffect(() => {
    handleSectionVisibility(sectionName, visibilityState[0]);
  }, [visibilityState[0]]);

  useEffect(() => {
    handleSectionOrder(sectionName, orderingState[0]);
  }, [orderingState[0]]);

  const handleUpdateJobExperience = (updatedExperience: IJobExperience) => {
    setJobExperiences((prevExperiences: IJobExperience[]) =>
      sortByKey(prevExperiences.map((experience: IJobExperience) =>
          experience._id === updatedExperience._id ? updatedExperience : experience
        ), 'startDate', true)
    );
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
      company: 'Company',
      companyLink: 'http://company.com',
      companyLocation: 'Company Str. 7, Somewhere',
      description: 'Add your description here',
      isVisible: false,
      startDate: new Date().getTime(),
      endDate: new Date().getTime()
    }
    compCreate(URL_PATH, experience, (response) => setJobExperiences([...jobExperiences, response.data]));
  };

  return (
    <div key={key}
      className={visibilityState[0] ? styles.jobExperienceList : `${styles.jobExperienceList} ${styles.sectionHidden}`}
    >
      <SectionControls
        isAdmin={isAdmin}
        styles={styles}
        visibilityState={visibilityState}
        orderingState={orderingState}
      >
        <h2 className={styles.sectionTitle}>
          <FontAwesomeIcon icon={faSuitcase} />
          Work Experience
        </h2>
      </SectionControls>

      {jobExperiences.map((experience: IJobExperience, index: number) => (
        <JobExperience
          key={experience._id}
          jobExperience={experience}
          onUpdate={handleUpdateJobExperience}
          onDelete={handleDeleteJobExperience}
          isAdmin={isAdmin}
          isLast={index === jobExperiences.length - 1}
          forExport={forExport}
        />
      ))}

      <AddExperience
        isAdmin={isAdmin}
        handleAddExperience={handleAddJobExperience}
        styles={styles}
      />
    </div>
  );
}