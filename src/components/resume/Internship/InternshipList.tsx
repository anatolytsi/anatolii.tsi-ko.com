import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicroscope } from '@fortawesome/free-solid-svg-icons';

import {Internship, IInternship} from './Internship';

import styles from './Internship.module.scss';
import { sortByKey } from '../common';
import { compCreate, compDelete } from '../common/api-helpers';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';

const URL_PATH = 'internships';

export function InternshipList({ data,
                                 isAdmin, 
                                 key=0,
                                 forExport=false,
                                 sectionName='internships',
                                 sectionOrder=0,
                                 sectionVisibility=true,
                                 handleSectionVisibility=() => {}, 
                                 handleSectionOrder=() => {} }: IExperienceListProps) {
  const [internships, setInternships] = useState<IInternship[]>(sortByKey(data, 'startDate', true));
  const visibilityState = useState(sectionVisibility);
  const orderingState = useState(sectionOrder);

  useEffect(() => {
    handleSectionVisibility(sectionName, visibilityState[0]);
  }, [visibilityState[0]]);

  useEffect(() => {
    handleSectionOrder(sectionName, orderingState[0]);
  }, [orderingState[0]]);

  const handleUpdateInternship = (updatedInternship: IInternship) => {
    setInternships((prevInternships: IInternship[]) =>
      sortByKey(prevInternships.map((internship: IInternship) =>
        internship._id === updatedInternship._id ? updatedInternship : internship
      ), 'startDate', true)
    );
  };

  const handleDeleteInternship = (internshipId: number) => {
    compDelete(URL_PATH, internshipId, (_response) => {
      setInternships((internships: IInternship[]) => 
        internships.filter( el => el._id !== internshipId )
      );
    });
  };

  const handleAddInternship = () => {
    let internship: IInternship = {
      title: 'Position',
      place: 'Place',
      placeLink: 'http://place.com',
      placeLocation: 'Place Str. 7, Somewhere',
      description: 'Add your description here',
      isVisible: false,
      startDate: new Date().getTime(),
      endDate: new Date().getTime()
    }
    compCreate(URL_PATH, internship, (response) => setInternships([...internships, response.data]));
  };

  const expListProps: IExpListProps = {
    styles: styles,
    isAdmin: isAdmin,
    visibilityState: visibilityState,
    orderingState: orderingState,
    faIcon: faMicroscope,
    sectionTitle: 'Internship'
  }

  return (
    <List key={key} {...expListProps}>
      {internships.map((internship: IInternship, index: number) => (
        <Internship
            key={internship._id}
            internship={internship}
            onUpdate={handleUpdateInternship}
            onDelete={handleDeleteInternship}
            isAdmin={isAdmin}
            isLast={index === internships.length - 1}
            forExport={forExport}
        />
      ))}
      <AddNew
        isAdmin={isAdmin}
        handleAddExperience={handleAddInternship}
        styles={styles}
      />
    </List>
  );
}