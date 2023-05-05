import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

import { EduExperience, IEduExperience } from './EduExperience';
import { AddExperience, ExperienceListProps } from '../Experience';

import styles from './Education.module.scss';
import { SectionControls } from '../common';
import { compCreate, compDelete } from '../common/api-helpers';

interface EduExperienceListProps extends ExperienceListProps {};

const URL_PATH = 'education';

export function EduExperienceList({ data,
                                    isAdmin, 
                                    key=0,
                                    forExport=false,
                                    sectionName='education',
                                    sectionOrder=0,
                                    sectionVisibility=true,
                                    handleSectionVisibility=() => {}, 
                                    handleSectionOrder=() => {} }: EduExperienceListProps) {
  let experiences = data;
  const [eduExperiences, setEduExperiences] = useState<IEduExperience[]>(experiences);
  const visibilityState = useState(sectionVisibility);
  const orderingState = useState(sectionOrder);

  useEffect(() => {
    handleSectionVisibility(sectionName, visibilityState[0]);
  }, [visibilityState[0]]);

  useEffect(() => {
    handleSectionOrder(sectionName, orderingState[0]);
  }, [orderingState[0]]);    

  const handleUpdateEduExperience = (updatedExperience: IEduExperience) => {
    setEduExperiences((prevExperiences: IEduExperience[]) =>
      prevExperiences.map((experience: IEduExperience) =>
        experience._id === updatedExperience._id ? updatedExperience : experience
      )
    );
  };

  const handleDeleteEduExperience = (experienceId: number) => {
    compDelete(URL_PATH, experienceId, (_response) => {
      setEduExperiences((experiences: IEduExperience[]) => 
        experiences.filter( el => el._id !== experienceId )
      );
    });
  };

  const handleAddEduExperience = () => {
    let experience: IEduExperience = {
      title: 'Degree',
      institute: 'Institute',
      instituteLink: 'http://institute.com',
      instituteLocation: 'Institute Str. 7, Somewhere',
      description: 'Add your description here',
      isVisible: false,
      startDate: new Date().getTime(),
      endDate: new Date().getTime()
    }
    compCreate(URL_PATH, experience, (response) => setEduExperiences([...eduExperiences, response.data]));
  };

  return (
    <div key={key}
      className={visibilityState[0] ? styles.eduExperienceList : `${styles.eduExperienceList} ${styles.sectionHidden}`}
    >
      <SectionControls
        isAdmin={isAdmin}
        styles={styles}
        visibilityState={visibilityState}
        orderingState={orderingState}
      >
        <h2>
            <FontAwesomeIcon icon={faGraduationCap} />
            Education
        </h2>
      </SectionControls>
      {eduExperiences.map((experience: IEduExperience, index: number) => (
        <EduExperience
            key={experience._id}
            eduExperience={experience}
            onUpdate={handleUpdateEduExperience}
            onDelete={handleDeleteEduExperience}
            isAdmin={isAdmin}
            isLast={index === eduExperiences.length - 1}
            forExport={forExport}
        />
      ))}

      <AddExperience
        isAdmin={isAdmin}
        handleAddExperience={handleAddEduExperience}
        styles={styles}
      />
    </div>
  );
}