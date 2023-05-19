import { useEffect, useState } from 'react';

import {Experience, GenericExperience, handleExpKeyDown} from '../Experience';
import styles from './Project.module.scss';
import { compUpdate } from '../common/api-helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

interface IProjectWebsite {
  name: string
  link: string
}

export interface IProject extends Experience {
    websites: IProjectWebsite[]
}

interface ProjectProps {
    project: IProject
    onUpdate: any
    onDelete: any
    isAdmin: boolean
    isLast: boolean
    forExport: boolean
}

export function Project({ project, onUpdate, onDelete, isAdmin, isLast, forExport=false }: ProjectProps) {
  const [experience, setExperience] = useState<IProject>(project);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  useEffect(() => {
    compUpdate('projects', experience, experience._id, (response) => onUpdate(response.data));
  }, [experience]);

  const handleSave = () => {
    setIsEditing(false);
    setExperience(experience);
  };

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave)
  };

  const addWebsite = () => {
    let websites = [...experience.websites];
    websites.push({name: 'New website', link: 'newwebsitelink.com'});
    setExperience({...experience, websites});
  }

  const updateWebsite = (website: IProjectWebsite, index: number) => {
    let newExperience = {...experience};
    newExperience.websites[index] = {...website};
    setExperience(newExperience);
  }

  const deleteWebsite = (index: number) => {
    let websites = [...experience.websites];
    websites.splice(index, 1);
    setExperience({...experience, websites});
  }

  const renderWebsites = () => {
    if (isEditing) {
      return (
        <div className={styles.websitesEdit}>
          {experience.websites.map((website: IProjectWebsite, index: number) => (
            <div className={styles.websiteEdit} key={index}>
              <button 
                  type="button" 
                  onClick={() => deleteWebsite(index)}
                  className={styles.deleteButton}
              >
                  <FontAwesomeIcon icon={faTrash} />
              </button>
              <div>
                <div className={styles.websiteName}>
                  <p>Website Name:</p>
                  <p
                    suppressContentEditableWarning
                    contentEditable
                    onBlur={e => updateWebsite(website, index)}
                  >
                    {website.name}
                  </p>
                </div>
                <div
                  className={styles.websiteLink}
                >
                  <p>Website Link:</p>
                  <p
                    suppressContentEditableWarning
                    contentEditable
                    onBlur={e => updateWebsite(website, index)}
                  >
                    {website.link}
                  </p>
                </div>
              </div>
            </div>
          ))}
            <button
                type='button'
                onClick={addWebsite}
                className={styles.websiteAdd}
            >
                <FontAwesomeIcon icon={faPlusCircle} /> Add website
            </button>
        </div>
      );
    } else {
      return (
        <div className={styles.websites}>
          {experience.websites.map((website: IProjectWebsite, index: number) => (
            <div className={styles.website} key={index}>
              {website.link ? (
                <a href={website.link}>
                  <h4>{website.name}{experience.websites.length - index - 1 ? ',' : ''}</h4>
                </a>
              ) : (
                <h4>{website.name}{experience.websites.length - index - 1 ? ',' : ''}</h4>
              )}
            </div>
          ))}
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
      addInfoRenderer={renderWebsites}
      showClamp={!forExport}
      // renderDates={false}
      mainStyleName='project'
    />
  );
}
