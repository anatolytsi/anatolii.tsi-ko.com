import { useEffect, useRef, useState } from 'react';

import {GenericExperience, Experience, handleExpKeyDown} from '../Experience';
import styles from './Internship.module.scss';
import { compUpdate } from '../common/api-helpers';
import { WAIT_EFFECT } from '../common';

export interface IInternship extends Experience {
    place: string
    placeLink?: string
    placeLocation?: string
    topic?: string
}

interface InternshipProps {
    internship: IInternship
    onUpdate: any
    onDelete: any
    isAdmin: boolean
    isLast: boolean
    forExport: boolean
}

export function Internship({ internship, onUpdate, onDelete, isAdmin, isLast, forExport=false }: InternshipProps) {
  const [experience, setExperience] = useState(internship);
  const [isEditing, setIsEditing] = useState(false);
  const firstUpdate = useRef(WAIT_EFFECT);
  
  useEffect(() => {
      if (firstUpdate.current) {
        firstUpdate.current--;
        return;
      }
      compUpdate('internship', experience, experience._id, (response) => onUpdate(response.data));
  }, [experience]);

  const handleSave = () => {
    setIsEditing(false);
    setExperience(experience)
  };

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave)
  };

  const renderPlace = () => {
    let place: JSX.Element;
    if (isEditing) {
      place = (
        <>
          <div className={styles.place}>
            <h4
              id='place'
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDown}
              onBlur={e =>
                setExperience({ ...experience, place: e.target.innerText })
              }
            >
              {experience.place}
            </h4>
          </div>
          <div
            id='placeLink'
            className={styles.placeLink}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            onBlur={e =>
              setExperience({ ...experience, placeLink: e.target.innerText })
            }
          >
            {experience.placeLink}
          </div>
        </>
      );
    } else {
      place = (
        <div className={styles.place}>
          {experience.placeLink ? (
            <a href={experience.placeLink}>
              <h4>{experience.place}</h4>
            </a>
          ) : (
            <h4>{experience.place}</h4>
          )}
        </div>
      );
    }
    return (
      <>
        {place}
        <div
          id='placeLocation'
          className={styles.placeLocation}
          contentEditable={isEditing}
          onKeyDown={handleKeyDown}
          onBlur={e =>
            setExperience({
              ...experience,
              placeLocation: e.target.innerText,
            })
          }
          suppressContentEditableWarning
        >
          {experience.placeLocation}
        </div>
      </>
    )
  };

  const renderTopic = () => {
    if (experience.topic || isEditing) {
      return (
        <div className={styles.addInfo}>
            Topic: 
            <span
              id='topic'
              className={styles.topic}
              contentEditable={isEditing}
              onKeyDown={handleKeyDown}
              onBlur={e =>
                setExperience({
                  ...experience,
                  topic: e.target.innerText,
                })
              }
              suppressContentEditableWarning
            >
              {experience.topic}
            </span>
        </div>
      );
    }
    return <></>;
  };

  const renderAddInfo = () => {
    return (
      <>
        {renderPlace()}
        {renderTopic()}
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
      showClamp={!forExport}
      // showClamp={false}
      // renderDates={false}
      mainStyleName='internship'
    />
  );
}
