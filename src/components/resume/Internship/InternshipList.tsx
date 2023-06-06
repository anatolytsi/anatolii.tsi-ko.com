import { useState } from 'react';

import { faMicroscope } from '@fortawesome/free-solid-svg-icons';

import {Internship, IInternship} from './Internship';

import styles from './Internship.module.scss';
import { ICommonResumeSectionProps, sortByKey } from '../common';
import { compCreate, compDelete } from '../common/api-helpers';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';
import { CommonSection } from '../common/Section';

export const InternshipSection = ({ editModeEnabled, 
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
                       faIcon={faMicroscope}
                       sectionTitle={'Internship'}
                       editModeEnabled={editModeEnabled}/>
    );
}

const URL_PATH = 'internships';

export function InternshipList({ data,
                                 editModeEnabled, 
                                 sectionVisible,
                                 forExport=false, }: IExperienceListProps) {
  const [internships, setInternships] = useState<IInternship[]>(sortByKey(data, 'startDate', true));

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
    sectionVisible: sectionVisible
  }

  return (
    <List {...expListProps}>
      {internships.map((internship: IInternship, index: number) => (
        <Internship
            key={internship._id}
            internship={internship}
            onUpdate={handleUpdateInternship}
            onDelete={handleDeleteInternship}
            editModeEnabled={editModeEnabled}
            isLast={index === internships.length - 1}
            forExport={forExport}
        />
      ))}
      <AddNew
        editModeEnabled={editModeEnabled}
        handleAddExperience={handleAddInternship}
        styles={styles}
      />
    </List>
  );
}