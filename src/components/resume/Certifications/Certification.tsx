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
}

export function Certification({ certification, onUpdate, onDelete, editModeEnabled, isLast, forExport=false }: ICertificationProps) {
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
    showClamp: !forExport,
    isLast: isLast,
    editModeEnabled: editModeEnabled,
    saver: handleSave,
    editor: () => setIsEditing(true),
    deleter: onDelete
  }

  const renderIssuer = () => {
    if (isEditing) {
      return (
        <>
          <div className={styles.issuer}>
            <h4
              id='issuer'
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDown}
              onBlur={e =>
                setExperience({ ...experience, issuer: e.target.innerText })
              }
            >
              {experience.issuer}
            </h4>
          </div>
          <div
            id='issuerLink'
            className={styles.issuerLink}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            onBlur={e =>
              setExperience({ ...experience, issuerLink: e.target.innerText })
            }
          >
            {experience.issuerLink}
          </div>
        </>
      );
    } else {
      return (
        <div className={styles.issuer}>
          {experience.issuerLink ? (
            <a href={experience.issuerLink}>
              <h4>{experience.issuer}</h4>
            </a>
          ) : (
            <h4>{experience.issuer}</h4>
          )}
        </div>
      );
    }
  };

  const renderCredentials = () => {
    if (isEditing) {
      return (
        <div className={styles.addInfo}>
          <div className={styles.credentialId}>
            Credential ID: 
            <span
              id='credentialId'
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDown}
              onBlur={e =>
                setExperience({ ...experience, credentialId: e.target.innerText })
              }
            >
              {experience.credentialId}
            </span>
          </div>
          <div
            id='credentialLink'
            className={styles.credentialLink}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            onBlur={e =>
              setExperience({ ...experience, credentialLink: e.target.innerText })
            }
          >
            {experience.credentialLink}
          </div>
        </div>
      );
    } else {
      if (experience.credentialId) {
        return (
          <div className={styles.addInfo}>
            <div className={styles.credentialId}>
              {experience.credentialLink ? (
                <a href={experience.credentialLink}>
                  Credential ID: <span>{experience.credentialId}</span>
                </a>
              ) : (
                <span>{experience.credentialId}</span>
              )}
            </div>
          </div>
        );
      } else {
        return <></>;
      }
    }
  };

  const renderAddInfo = () => {
    return (
      <>
        {renderIssuer()}
        {renderCredentials()}
      </>
    );
  };

  return (
    <EditableContent {...expProps}>
      <Content {...expProps}>
        <Header {...expProps}>
          <HeaderLine {...expProps}>
            <Title {...expProps}/>
            <Date {...expProps}/>
          </HeaderLine>
          <div className={styles.issuerAndCredentials}>
            <Issuer {...expProps}/>
            {
              !isEditing && experience.credentialId ?
                <span className={styles.credentialsSeparator}>, Credentials </span>
              : 
                <></>
            }
            <Credentials {...expProps}/>
          </div>
        </Header>
      </Content>
    </EditableContent>
  );
}
