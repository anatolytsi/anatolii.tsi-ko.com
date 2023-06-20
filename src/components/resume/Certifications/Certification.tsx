import { useEffect, useState } from 'react';

import { Content, Credentials, Date, EditableContent, Header, HeaderLine, Issuer, Title, handleExpKeyDown } from '../Experience';
import styles from './Certification.module.scss';
import { ICommonExperienceProps, IExperience } from '../Experience/common';

export interface ICertification extends IExperience {
  date: number
  issuer: string
  issuerLink: string
  credentialId: string
  credentialLink: string
}

interface ICertificationProps {
    certification: ICertification
    onUpdate: any
    onDelete: any
    editModeEnabled: boolean
    isLast: boolean
    forExport: boolean
    shortVersion?: boolean
}

export function Certification({ certification, onUpdate, onDelete, editModeEnabled, isLast, forExport=false, shortVersion=false }: ICertificationProps) {
  const [experience, setExperience] = useState(certification);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(experience);
  };

  useEffect(() => {
      if (isEditing) {
          handleSave();
      }
  }, [editModeEnabled]);

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave)
  };

  const expProps: ICommonExperienceProps = {
    styles: styles,
    isEditing: isEditing,
    setter: setExperience,
    keyDown: () => {},
    exp: experience,
    forExport: forExport,
    isLast: isLast,
    editModeEnabled: editModeEnabled,
    saver: handleSave,
    editor: () => setIsEditing(true),
    deleter: onDelete
  }

  return (
    <EditableContent {...expProps}>
      <Content {...expProps}>
        <Header {...expProps}>
          <HeaderLine {...expProps}>
            <div className={editModeEnabled ? `${styles.titleAndCredits} ${styles.editing}` : styles.titleAndCredits}>
              <Title {...expProps}/>
              {shortVersion ? '' :
                <div className={editModeEnabled ? `${styles.issuerAndCredentials} ${styles.editing}` : styles.issuerAndCredentials}>
                  <Issuer {...expProps}/>
                  {
                    !isEditing && experience.credentialId ?
                      <span className={styles.credentialsSeparator}>, Credentials </span>
                    : 
                      <></>
                  }
                  <Credentials {...expProps}/>
                </div>
              }
            </div>
            <Date {...expProps}/>
          </HeaderLine>
        </Header>
      </Content>
    </EditableContent>
  );
}
