import { useState } from 'react';
import { faAward } from '@fortawesome/free-solid-svg-icons';

import {Certification, ICertification} from './Certification';

import styles from './Certification.module.scss';
import { ICommonResumeSectionProps, sortByKey } from '../common';
import { compCreate, compDelete } from '../common/api-helpers';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';
import { CommonSection } from '../common/Section';

export const CertificationsSection = ({ editModeEnabled, 
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
                       faIcon={faAward}
                       sectionTitle={'Certifications'}
                       editModeEnabled={editModeEnabled}/>
    );
}

const URL_PATH = 'certifications';

export function CertificationList({ data,
                                    editModeEnabled, 
                                    sectionVisible,
                                    forExport=false, }: IExperienceListProps) {
  const [certifications, setCertifications] = useState<ICertification[]>(sortByKey(data, 'date', true));

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
    sectionVisible: sectionVisible
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