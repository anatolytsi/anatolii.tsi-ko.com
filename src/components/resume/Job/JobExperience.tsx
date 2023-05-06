import { useEffect, useState } from 'react';
import axios from 'axios';

import {Experience, GenericExperience, handleExpKeyDown} from '../Experience';
import styles from './Job.module.scss';
import { compUpdate } from '../common/api-helpers';

export interface IJobExperience extends Experience {
    company: string
    companyLink?: string
    companyLocation?: string
}

interface JobExperienceProps {
    jobExperience: IJobExperience
    onUpdate: any
    onDelete: any
    isAdmin: boolean
    isLast: boolean
    forExport: boolean
}

export function JobExperience({ jobExperience, onUpdate, onDelete, isAdmin, isLast, forExport=false }: JobExperienceProps) {
  const [experience, setExperience] = useState<IJobExperience>(jobExperience);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  useEffect(() => {
    compUpdate('jobs', experience, experience._id, (response) => onUpdate(response.data));
  }, [experience]);

  const handleSave = () => {
    setIsEditing(false);
    setExperience(experience);
  };

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave)
  };

  const renderCompany = () => {
    let company: JSX.Element;
    if (isEditing) {
      company = (
        <>
          <div className={styles.company}>
            <h4
              id='company'
              suppressContentEditableWarning
              contentEditable
              onBlur={e =>
                setExperience({ ...experience, company: e.target.innerText })
              }
              onKeyDown={handleKeyDown}
            >
              {experience.company}
            </h4>
          </div>
          <div
            className={styles.companyLink}
            id='companyLink'
            suppressContentEditableWarning
            contentEditable
            onBlur={e =>
              setExperience({ ...experience, companyLink: e.target.innerText })
            }
            onKeyDown={handleKeyDown}
          >
            {experience.companyLink}
          </div>
        </>
      );
    } else {
      company = (
        <div className={styles.company}>
          {experience.companyLink ? (
            <a href={experience.companyLink}>
              <h4>{experience.company}</h4>
            </a>
          ) : (
            <h4>{experience.company}</h4>
          )}
        </div>
      );
    }
    return (
      <>
        {company}
        <div
          id='companyLocation'
          className={styles.companyLocation}
          contentEditable={isEditing}
          onBlur={e =>
            setExperience({
              ...experience,
              companyLocation: e.target.innerText,
            })
          }
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning
        >
          {experience.companyLocation}
        </div>
      </>
    )
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
      addInfoRenderer={renderCompany}
      showClamp={!forExport}
      // renderDates={false}
      mainStyleName='jobExperience'
    />
  );
}
