import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';

import {Certification, ICertification} from './Certification';
import { AddExperience, ExperienceListProps } from '../Experience';

import styles from './Certification.module.scss';
import { SectionControls, sortByKey } from '../common';
import { compCreate, compDelete } from '../common/api-helpers';

interface CertificationListProps extends ExperienceListProps {};

const URL_PATH = 'certifications';

export function CertificationList({ data,
                                    isAdmin, 
                                    key=0,
                                    forExport=false,
                                    sectionName='certifications',
                                    sectionOrder=0,
                                    sectionVisibility=true,
                                    handleSectionVisibility=() => {}, 
                                    handleSectionOrder=() => {} }: CertificationListProps) {
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

  return (
    <div key={key}
      className={visibilityState[0] ? styles.certificationList : `${styles.certificationList} ${styles.sectionHidden}`}
    >
      <SectionControls
        isAdmin={isAdmin}
        styles={styles}
        visibilityState={visibilityState}
        orderingState={orderingState}
      >
        <h2>
            <FontAwesomeIcon icon={faAward} />
            Certifications
        </h2>
      </SectionControls>
      {certifications.map((certification: ICertification, index: number) => (
        <Certification
            key={certification._id}
            certification={certification}
            onUpdate={handleUpdateCertification}
            onDelete={handleDeleteCertification}
            isAdmin={isAdmin}
            isLast={index === certifications.length - 1}
            forExport={forExport}
        />
      ))}

      <AddExperience
        isAdmin={isAdmin}
        handleAddExperience={handleAddCertification}
        styles={styles}
      />
    </div>
  );
}