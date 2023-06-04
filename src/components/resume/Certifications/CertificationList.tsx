import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';

import {Certification, ICertification} from './Certification';

import styles from './Certification.module.scss';
import { sortByKey } from '../common';
import { compCreate, compDelete } from '../common/api-helpers';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';

const URL_PATH = 'certifications';

export function CertificationList({ data,
                                    editModeEnabled, 
                                    key=0,
                                    forExport=false,
                                    sectionName='certifications',
                                    sectionOrder=0,
                                    sectionVisibility=true,
                                    handleSectionVisibility=() => {}, 
                                    handleSectionOrder=() => {} }: IExperienceListProps) {
  const [certifications, setCertifications] = useState<ICertification[]>(sortByKey(data, 'date', true));
  const visibilityState = useState(sectionVisibility);
  const orderingState = useState(sectionOrder);

  useEffect(() => {
    handleSectionVisibility(sectionName, visibilityState[0]);
  }, [visibilityState[0]]);

  useEffect(() => {
    handleSectionOrder(sectionName, orderingState[0]);
  }, [orderingState[0]]);

  const handleUpdateCertification = (updatedCertification: ICertification) => {
    setCertifications((prevCertifications: ICertification[]) =>
      sortByKey(prevCertifications.map((certification: ICertification) =>
        certification._id === updatedCertification._id ? updatedCertification : certification
      ), 'date', true)
    );
  };

  const handleDeleteCertification = (certificationId: number) => {
    compDelete(URL_PATH, certificationId, (_response) => {
      setCertifications((certifications: ICertification[]) => 
        certifications.filter( el => el._id !== certificationId )
      );
    });
  };

  const handleAddCertification = () => {
    let certification: ICertification = {
      title: 'Course',
      issuer: 'Certificate Issuer',
      issuerLink: 'http://issuer.com',
      credentialId: 'CREDENTID',
      credentialLink: 'http://issuer.com/CREDENTID',
      date: new Date().getTime(),
      isVisible: false,
    }
    compCreate(URL_PATH, certification, (response) => setCertifications([...certifications, response.data]));
  };

  const expListProps: IExpListProps = {
    styles: styles,
    editModeEnabled: editModeEnabled,
    visibilityState: visibilityState,
    orderingState: orderingState,
    faIcon: faAward,
    sectionTitle: 'Certifications'
  }

  return (
    <List key={key} {...expListProps}>

      {certifications.map((certification: ICertification, index: number) => (
        <Certification
            key={certification._id}
            certification={certification}
            onUpdate={handleUpdateCertification}
            onDelete={handleDeleteCertification}
            editModeEnabled={editModeEnabled}
            isLast={index === certifications.length - 1}
            forExport={forExport}
        />
      ))}

      <AddNew
        editModeEnabled={editModeEnabled}
        handleAddExperience={handleAddCertification}
        styles={styles}
      />
    </List>
  );
}