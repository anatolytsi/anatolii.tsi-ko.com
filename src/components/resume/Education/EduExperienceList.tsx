import { useState } from 'react';

import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

import { EduExperience, IEduExperience } from './EduExperience';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';

import styles from './Education.module.scss';
import { ICommonResumeSectionProps } from '../common';
import { compCreate, compDelete, compUpdate } from '../common/api-helpers';
import { CommonSection } from '../common/Section';
import { sortByEndDate } from '../Experience/common';

const URL_PATH = 'education';

export const EducationSection = ({ editModeEnabled, 
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
                       faIcon={faGraduationCap}
                       sectionTitle={'Education'}
                       editModeEnabled={editModeEnabled}/>
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
    compUpdate(URL_PATH, updatedExperience, updatedExperience._id);
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
      place: 'Place',
      placeLink: 'http://place.com',
      placeLocation: 'Place Str. 7, Somewhere',
      description: 'Add your description here',
      isVisible: false,
      startDate: new Date().getTime(),
      endDate: new Date().getTime()
    }
    compCreate(URL_PATH, experience, (response) => setEduExperiences([...eduExperiences, response.data]));
  };

  const expListProps: IExpListProps = {
    styles: styles,
    sectionVisible: sectionVisible
  }

  return (
    <List {...expListProps}>
      {eduExperiences.map((experience: IEduExperience, index: number) => (
        <EduExperience
            key={experience._id}
            eduExperience={experience}
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