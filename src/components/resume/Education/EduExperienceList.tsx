import { useEffect, useState } from 'react';

import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

import { EduExperience, IEduExperience } from './EduExperience';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';

import styles from './Education.module.scss';
import { sortByKey } from '../common';
import { compCreate, compDelete } from '../common/api-helpers';

const URL_PATH = 'education';

export function EduExperienceList({ data,
                                    isAdmin, 
                                    key=0,
                                    forExport=false,
                                    sectionName='education',
                                    sectionOrder=0,
                                    sectionVisibility=true,
                                    handleSectionVisibility=() => {}, 
                                    handleSectionOrder=() => {} }: IExperienceListProps) {
  let experiences = data;
  const [eduExperiences, setEduExperiences] = useState<IEduExperience[]>(sortByKey(experiences, 'startDate', true));
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
      sortByKey(prevExperiences.map((experience: IEduExperience) =>
        experience._id === updatedExperience._id ? updatedExperience : experience
      ), 'startDate', true)
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
    isAdmin: isAdmin,
    visibilityState: visibilityState,
    orderingState: orderingState,
    faIcon: faGraduationCap,
    sectionTitle: 'Education'
  }

  return (
    <List key={key} {...expListProps}>
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
      <AddNew
        isAdmin={isAdmin}
        handleAddExperience={handleAddEduExperience}
        styles={styles}
      />
    </List>
  );
}