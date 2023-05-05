import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicroscope } from '@fortawesome/free-solid-svg-icons';

import {Internship, IInternship} from './Internship';
import { AddExperience, ExperienceListProps } from '../Experience';

import styles from './Internship.module.scss';
import { SectionControls } from '../common';
import { compCreate, compDelete } from '../common/api-helpers';

interface InternshipListProps extends ExperienceListProps {};

const URL_PATH = 'internship';

export function InternshipList({ data,
                                 isAdmin, 
                                 key=0,
                                 forExport=false,
                                 sectionName='internships',
                                 sectionOrder=0,
                                 sectionVisibility=true,
                                 handleSectionVisibility=() => {}, 
                                 handleSectionOrder=() => {} }: InternshipListProps) {
  let internshipExps = data;
  if (!isAdmin) {
    internshipExps = internshipExps.filter((el: IInternship) => el.isVisible);
  }
  const [internships, setInternships] = useState<IInternship[]>(internshipExps);
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
      prevInternships.map((internship: IInternship) =>
        internship._id === updatedInternship._id ? updatedInternship : internship
      )
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

  return (
    <div key={key} className={visibilityState[0] ? styles.internshipList : `${styles.internshipList} ${styles.sectionHidden}`}>
      <SectionControls
        isAdmin={isAdmin}
        styles={styles}
        visibilityState={visibilityState}
        orderingState={orderingState}
      >
        <h2>
            <FontAwesomeIcon icon={faMicroscope} />
            Internship
        </h2>
      </SectionControls>
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

      <AddExperience
        isAdmin={isAdmin}
        handleAddExperience={handleAddInternship}
        styles={styles}
      />
    </div>
  );
}