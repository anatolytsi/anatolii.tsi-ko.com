import { useEffect, useRef, useState } from 'react';

import {GenericExperience, Experience, handleExpKeyDown} from '../Experience';
import styles from './Education.module.scss';
import { compUpdate } from '../common/api-helpers';

export interface IEduExperience extends Experience {
    institute: string
    instituteLink?: string
    instituteLocation?: string
    finalGrade?: string
    thesisTopic?: string
}

interface EduExperienceProps {
    eduExperience: IEduExperience
    onUpdate: any
    onDelete: any
    isAdmin: boolean
    isLast: boolean
    forExport: boolean
}

export function EduExperience({ eduExperience, onUpdate, onDelete, isAdmin, isLast, forExport=false }: EduExperienceProps) {
  const [experience, setExperience] = useState(eduExperience);
  const [isEditing, setIsEditing] = useState(false);
  const firstUpdate = useRef(2);
  
  useEffect(() => {
      if (firstUpdate.current) {
        firstUpdate.current--;
        return;
      }
      compUpdate('education', experience, experience._id, (response) => onUpdate(response.data));
  }, [experience]);

  const handleSave = () => {
    setIsEditing(false);
    setExperience(experience)
  };

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave);
  };

  const renderInstituteLocation = () => {
    return (
      <div
        id='instituteLocation'
        className={styles.instituteLocation}
        contentEditable={isEditing}
        onKeyDown={handleKeyDown}
        onBlur={e =>
          setExperience({
            ...experience,
            instituteLocation: e.target.innerText,
          })
        }
        suppressContentEditableWarning
      >
        {experience.instituteLocation}
      </div>
    );
  };

  const renderInstitute = () => {
    if (isEditing) {
      return (
        <>
          <div className={styles.institute}>
            <h4
              id='institute'
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDown}
              onBlur={e =>
                setExperience({ ...experience, institute: e.target.innerText })
              }
            >
              {experience.institute}
            </h4>
          </div>
          <div
            id='instituteLink'
            className={styles.instituteLink}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            onBlur={e =>
              setExperience({ ...experience, instituteLink: e.target.innerText })
            }
          >
            {experience.instituteLink}
          </div>
        </>
      );
    } else {
      return (
        <div className={styles.institute}>
          {experience.instituteLink ? (
            <a href={experience.instituteLink}>
              <h4>{experience.institute}</h4>
            </a>
          ) : (
            <h4>{experience.institute}</h4>
          )}
        </div>
      );
    }
  };

  const renderGradeAndThesis = () => {
    if (eduExperience.finalGrade || eduExperience.thesisTopic) {
      return (
        <div className={styles.addInfo}>
          {(experience.finalGrade || isEditing) ? (
            <>
              Grade: 
              <span
                id='finalGrade'
                className={styles.finalGrade}
                contentEditable={isEditing}
                onKeyDown={handleKeyDown}
                onBlur={e =>
                  setExperience({
                    ...experience,
                    finalGrade: e.target.innerText,
                  })
                }
                suppressContentEditableWarning
              >
                {experience.finalGrade}
              </span>
            </>
          ) : (
            <></>
          )}
          {(experience.thesisTopic || isEditing) ? (
            <div>
              Thesis Topic: 
              <span
                id='thesisTopic'
                className={styles.thesisTopic}
                contentEditable={isEditing}
                onKeyDown={handleKeyDown}
                onBlur={e =>
                  setExperience({
                    ...experience,
                    thesisTopic: e.target.innerText,
                  })
                }
                suppressContentEditableWarning
              >
                {experience.thesisTopic}
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
      );
    }
    return <></>;
  };

  const renderAddInfo = () => {
    return (
      <>
        {renderInstitute()}
        {renderInstituteLocation()}
        {renderGradeAndThesis()}
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
      // datesNeeded={false}
      mainStyleName='eduExperience'
    />
  );
}
