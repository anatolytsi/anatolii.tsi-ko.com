import { useEffect, useState } from 'react';

import {GenericExperience, Experience, handleExpKeyDown} from '../Experience';
import styles from './Certification.module.scss';
import { compUpdate } from '../common/api-helpers';

export interface ICertification extends Experience {
  date: number
  issuer: string
  issuerLink: string
  credentialId: string
  credentialLink: string
}

interface CertificationProps {
    certification: ICertification
    onUpdate: any
    onDelete: any
    isAdmin: boolean
    isLast: boolean
    forExport: boolean
}

export function Certification({ certification, onUpdate, onDelete, isAdmin, isLast, forExport=false }: CertificationProps) {
  const [experience, setExperience] = useState(certification);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
      compUpdate('certifications', experience, experience._id, (response) => onUpdate(response.data));
  }, [experience]);

  const handleSave = () => {
    setIsEditing(false);
    setExperience(experience)
  };

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave)
  };

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
    <GenericExperience
      experience={experience}
      setExperience={setExperience}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      onDelete={onDelete}
      handleSave={handleSave}
      isAdmin={isAdmin}
      isLast={isLast}
      styles={styles}
      addInfoRenderer={renderAddInfo}
      mainStyleName='certification'
      dateFormat='MMM yyyy'
      showClamp={!forExport}
    />
  );
}
