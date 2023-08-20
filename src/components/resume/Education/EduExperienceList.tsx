import { useState } from 'react';

import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

import { EduExperience, IEduExperience } from './EduExperience';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';

import styles from './Education.module.scss';
import { ICommonResumeSectionProps } from '../common';
import { compCreate, compDelete, compUpdate } from '../common/api-helpers';
import { CommonSection } from '../common/Section';
import { sortByEndDate } from '../Experience/common';

const COMPONENT = 'resume';
const URL_PATH = 'education';

export const EducationSection = (props: ICommonResumeSectionProps) => {
    return (
        <CommonSection {...props} styles={styles} faIcon={faGraduationCap} sectionTitle={'Education'}/>
    );
}

export function EduExperienceList({ data,
                                    editModeEnabled, 
                                    sectionVisible,
                                    forExport=false,
                                    shortVersion=false }: IExperienceListProps) {
  let experiences = data;
  const [eduExperiences, setEduExperiences] = useState<IEduExperience[]>(sortByEndDate(experiences));

  const handleUpdateEduExperience = (updatedExperience: IEduExperience) => {
    setEduExperiences((prevExperiences: IEduExperience[]) =>
      sortByEndDate(prevExperiences.map((experience: IEduExperience) =>
        experience._id === updatedExperience._id ? updatedExperience : experience
      ))
    );
    compUpdate(COMPONENT, URL_PATH, updatedExperience, updatedExperience._id);
  };

  const handleDeleteEduExperience = (experienceId: number) => {
    compDelete(COMPONENT, URL_PATH, experienceId, (_response) => {
      setEduExperiences((experiences: IEduExperience[]) => 
        experiences.filter( el => el._id !== experienceId )
      );
    });
  };

  const handleAddEduExperience = () => {
    let experience: IEduExperience = {
      title: 'Degree',
      place: 'Place',
      placeLink: 'http://place.com',
      placeLocation: 'Place Str. 7, Somewhere',
      description: 'Add your description here',
      isVisible: false,
      startDate: new Date().getTime(),
      endDate: new Date().getTime()
    }
    compCreate(COMPONENT, URL_PATH, experience, (response) => setEduExperiences([...eduExperiences, response.data]));
  };

  const expListProps: IExpListProps = {
    styles: styles,
    sectionVisible: sectionVisible,
    forExport: forExport,
    singlePage: shortVersion
  }

  return (
    <List {...expListProps}>
      {eduExperiences.map((experience: IEduExperience, index: number) => (
        <EduExperience
            key={experience._id}
            experience={experience}
            onUpdate={handleUpdateEduExperience}
            onDelete={handleDeleteEduExperience}
            editModeEnabled={editModeEnabled}
            isLast={index === eduExperiences.length - 1}
            forExport={forExport}
            shortVersion={shortVersion}
        />
      ))}
      <AddNew
        editModeEnabled={editModeEnabled}
        handleAddExperience={handleAddEduExperience}
        styles={styles}
      />
    </List>
  );
}