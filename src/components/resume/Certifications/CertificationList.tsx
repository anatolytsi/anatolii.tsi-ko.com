import { useState } from 'react';
import { faAward } from '@fortawesome/free-solid-svg-icons';

import {Certification, ICertification} from './Certification';

import styles from './Certification.module.scss';
import { ICommonResumeSectionProps, sortByKey } from '../common';
import { compCreate, compDelete, compUpdate } from '../common/api-helpers';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';
import { CommonSection } from '../common/Section';

export const CertificationsSection = (props: ICommonResumeSectionProps) => {
    return (
        <CommonSection {...props} styles={styles} faIcon={faAward} sectionTitle={'Certifications'}/>
    );
}

const URL_PATH = 'certifications';

export function CertificationList({ data,
                                    editModeEnabled, 
                                    sectionVisible,
                                    forExport=false,
                                    shortVersion=false }: IExperienceListProps) {
  const [certifications, setCertifications] = useState<ICertification[]>(sortByKey(data, 'date', true));

  const handleUpdateCertification = (updatedCertification: ICertification) => {
    setCertifications((prevCertifications: ICertification[]) =>
      sortByKey(prevCertifications.map((certification: ICertification) =>
        certification._id === updatedCertification._id ? updatedCertification : certification
      ), 'date', true)
    );
    compUpdate(URL_PATH, updatedCertification, updatedCertification._id);
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
    sectionVisible: sectionVisible,
    forExport: forExport,
    singlePage: shortVersion
  }

  return (
    <List {...expListProps}>

      {certifications.map((certification: ICertification, index: number) => (
        <Certification
            key={certification._id}
            certification={certification}
            onUpdate={handleUpdateCertification}
            onDelete={handleDeleteCertification}
            editModeEnabled={editModeEnabled}
            isLast={index === certifications.length - 1}
            forExport={forExport}
            shortVersion={shortVersion}
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