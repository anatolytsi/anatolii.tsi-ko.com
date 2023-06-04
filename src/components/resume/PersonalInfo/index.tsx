import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import styles from './PersonalInfo.module.scss';
import { compUpdate } from '../common/api-helpers';
import { IPersonalInfo, IPersonalInfoCommonProps } from './common';
import { ExternalLinks } from './ExternalLinks';
import { Email } from './Email';
import { Phone } from './Phone';
import { Address } from './Address';
import { Birthday } from './Birthday';
import { FullName } from './FullName';
import { Photo } from './Photo';
import { Summary } from './Summary';
import { EditButton } from './EditButton';

interface PersonalInfoProps {
  data: IPersonalInfo
  editModeEnabled: boolean
  forExport?: boolean
}

export function PersonalInfo({ data, editModeEnabled, forExport=false }: PersonalInfoProps) {
  const [personalInfo, setPersonalInfo] = React.useState<IPersonalInfo>(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    compUpdate('personalInfo', personalInfo, personalInfo._id, (response) => {console.log(response.data); setPersonalInfo(personalInfo)});
  }, [personalInfo]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    setPersonalInfo(personalInfo);
  };

  const handleKeyDown = (event: any) => {
    if (isEditing) {
      let charCode = String.fromCharCode(event.which).toLowerCase();
      if((event.ctrlKey || event.metaKey) && charCode === 's') {
        event.preventDefault();
        if (event.target.id && event.target.innerText && event.target.id in personalInfo) {
          setPersonalInfo({...personalInfo, [`${event.target.id}`]: event.target.innerText});
          handleSave();
        }
      }
    }
  }

  const commonProps: IPersonalInfoCommonProps = {
    isEditing: isEditing, 
    personalInfo: personalInfo, 
    setter: setPersonalInfo, 
    styles: styles,
    keyDown: handleKeyDown,
    forExport: forExport,
    editModeEnabled: editModeEnabled,
    setSave: handleSave,
    setEdit: handleEdit
  }

  return (
    <div className={`${styles.personalInfoEdit} ${forExport ? styles.forExport : ''}`}>
      <div className={styles.personalInfo}>
        <div className={styles.left}>
          <Photo {...commonProps}/>
          <div className={styles.contact}>
            <FullName {...commonProps}/>
            <Birthday {...commonProps}/>
            <Address {...commonProps}/>
            <Email {...commonProps}/>
            <Phone {...commonProps}/>
            <ExternalLinks {...commonProps}/>
          </div>
        </div>
        <div className={styles.right}>
          <Summary {...commonProps}/>
        </div>
      </div>
      <EditButton {...commonProps}/>
    </div>
  );
}