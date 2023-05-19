import { useEffect, useState } from 'react';

import {GenericExperience, Experience, handleExpKeyDown} from '../Experience';
import styles from './Publication.module.scss';
import { compUpdate } from '../common/api-helpers';

export interface IPublication extends Experience {
  date: number
  conference: string
  conferenceLink: string
}

interface PublicationProps {
    publication: IPublication
    onUpdate: any
    onDelete: any
    isAdmin: boolean
    isLast: boolean
    forExport: boolean
}

export function Publication({ publication, onUpdate, onDelete, isAdmin, isLast, forExport=false }: PublicationProps) {
  const [experience, setExperience] = useState(publication);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
      compUpdate('publications', experience, experience._id, (response) => onUpdate(response.data));
  }, [experience]);

  const handleSave = () => {
    setIsEditing(false);
    setExperience(experience)
  };

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave)
  };

  const renderConference = () => {
    if (isEditing) {
      return (
        <>
          <div className={styles.conference}>
            <h4
              id='conference'
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDown}
              onBlur={e =>
                setExperience({ ...experience, conference: e.target.innerText })
              }
            >
              {experience.conference}
            </h4>
          </div>
          <div
            id='conferenceLink'
            className={styles.conferenceLink}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            onBlur={e =>
              setExperience({ ...experience, conferenceLink: e.target.innerText })
            }
          >
            {experience.conferenceLink}
          </div>
        </>
      );
    } else {
      return (
        <div className={styles.conference}>
          {experience.conferenceLink ? (
            <a href={experience.conferenceLink}>
              <h4>{experience.conference}</h4>
            </a>
          ) : (
            <h4>{experience.conference}</h4>
          )}
        </div>
      );
    }
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
      addInfoRenderer={renderConference}
      mainStyleName='publication'
      dateFormat='MMM yyyy'
      showClamp={!forExport}
    />
  );
}
