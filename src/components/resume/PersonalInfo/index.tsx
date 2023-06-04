import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Markdown from 'markdown-to-jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faSave,
  faBirthdayCake,
  faHome,
  faPhone,
  faEnvelope,
  faListAlt,
  faGlobe,
  faChain
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import 'react-datepicker/dist/react-datepicker.css';
import styles from './PersonalInfo.module.scss';
import { DescriptionClamp } from '../common/DescriptionClamp';
import axios from 'axios';
import { compUpdate, uploadFile } from '../common/api-helpers';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const SimpleMDEEditor = dynamic(
    () => import('react-simplemde-editor'),
    {ssr: false}
);

enum EWebsite {
  github = 'GitHub',
  website = 'Website',
  linkedin = 'LinkedIn'
}

type IWebsite = {
  [key in EWebsite]: string;
}

export interface IPersonalInfo {
  _id?: string
  fullName: string
  birthday: number
  photoSrc: any
  address: string
  phone: string
  email: string
  summary: string
  websites?: IWebsite;
}

interface PersonalInfoProps {
  data: IPersonalInfo
  isAdmin: boolean
  forExport?: boolean
}

interface IExternalLinkProps {
  isEditing: boolean
  name: EWebsite
  link: string | undefined
  icon: IconProp
  updater: any
}

interface IExternalLinksProps {
  personalInfo: IPersonalInfo
  setter: any
  isEditing: boolean
}

const ExternalLink = ({ isEditing,
                        name,
                        link='',
                        icon,
                        updater }: IExternalLinkProps) => {
  if (isEditing) {
    return (<>
      <div className={styles.website}>
        {name}:
        <span
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={e =>
            updater(name, e.target.innerText)
          }
        >
          {link}
        </span>
      </div>
    </>);
  } else {
    console.log(link)
    if (link) {
      console.log(link)
      return (
        <a className={styles.extLink} href={link}>
          <FontAwesomeIcon icon={icon} />
        </a>
      );
    } else {
      return <></>;
    }
  }
}

const ExternalLinks = ({ personalInfo, isEditing, setter }: IExternalLinksProps) => {
  const anyWebsites = !!personalInfo?.websites?.[EWebsite.website] || !!personalInfo?.websites?.[EWebsite.github] || !!personalInfo?.websites?.[EWebsite.linkedin];
  const updateWebsite = ( name: EWebsite, link: string ) => {
    let websites = {...personalInfo?.websites, [name]: link};
    setter({...personalInfo, websites });
  }
  return (
    <div className={styles.websites}>
      {anyWebsites || isEditing ? 
        <FontAwesomeIcon icon={faChain} />
      : <></>}
      <ExternalLink isEditing={isEditing} name={EWebsite.website} link={personalInfo?.websites?.[EWebsite.website]} icon={faGlobe} updater={updateWebsite}/>
      <ExternalLink isEditing={isEditing} name={EWebsite.github} link={personalInfo?.websites?.[EWebsite.github]} icon={faGithub} updater={updateWebsite}/>
      <ExternalLink isEditing={isEditing} name={EWebsite.linkedin} link={personalInfo?.websites?.[EWebsite.linkedin]} icon={faLinkedinIn} updater={updateWebsite}/>
    </div>
  );
}

export function PersonalInfo({ data, isAdmin, forExport=false }: PersonalInfoProps) {
  const [personalInfo, setPersonalInfo] = React.useState<IPersonalInfo>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  
  const getYears = (birthdayMilis: any) => {
    let ageDifMs = Date.now() - birthdayMilis;
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  const [age, setAge] = useState(getYears(personalInfo.birthday))

  useEffect(() => {
    compUpdate('personalInfo', personalInfo, personalInfo._id, (response) => {console.log(response.data); setPersonalInfo(personalInfo)});
  }, [personalInfo]);

  useEffect(() => {
    setAge(getYears(personalInfo.birthday));
  }, [personalInfo.birthday]);

  useEffect(() => {
    if (!file) {
      return;
    }
    const body = new FormData();
    body.append('media', file);
    uploadFile('file', body, (response) => {console.log(response.data.data.url); setPersonalInfo({...personalInfo, photoSrc: response.data.data.url})});
  }, [file]);

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

  const handlePhotoUpload = (event: any) => {
    if (event.target.files.length > 0) {
      const loadedFile = event.target.files[0];
      if (!loadedFile.type.startsWith("image")) {
        alert("Please select a valid image");
        return;
      }
      const filePreviewUrl = URL.createObjectURL(loadedFile);
      setPersonalInfo({...personalInfo, photoSrc: filePreviewUrl});
      setFile(loadedFile);
    }
  };

  const PhotoUpload = ({children}: any) => {
    if (isEditing) {
      return (
        <>
          <input type="file" onChange={handlePhotoUpload} id="photoUpload" accept="image/*" style={{display: "none"}}/>
          <label htmlFor="photoUpload">
            {children}
          </label>
        </>
      )
    } else {
      return <>{children}</>;
    }
  }

  const renderEdit = () => {
    if (isAdmin) {
      return (
        <div className={styles.controls}>
          <button 
              type="button" 
              onClick={isEditing ? handleSave : handleEdit}
              className={isEditing ? `${styles.editButton} ${styles.isEditing}` : styles.editButton}
          >
              {isEditing ? (
                  <FontAwesomeIcon icon={faSave} />
              ) : (
                  <FontAwesomeIcon icon={faEdit} />
              )}
          </button>
        </div>
      );
    }
    return '';
  };

  return (
    <div className={`${styles.personalInfoEdit} ${forExport ? styles.forExport : ''}`}>
      <div className={styles.personalInfo}>
        <div className={styles.left}>
          <PhotoUpload>
            <img 
              className={styles.avatar}
              src={personalInfo.photoSrc}
              alt="Avatar"
            />
          </PhotoUpload>
          <div className={styles.contact}>
            <h1 
              id='fullName'
              onKeyDown={handleKeyDown}
              className={styles.name}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e =>
                setPersonalInfo({ ...personalInfo, fullName: e.target.innerText })
              }
            >
              {personalInfo.fullName}
            </h1>
            <div className={styles.contactItem}>
              <FontAwesomeIcon icon={faBirthdayCake} />
              <DatePicker
                wrapperClassName={styles.birthday}
                selected={new Date(personalInfo.birthday)}
                className={isEditing ? styles.editingBirthday : ''}
                readOnly={!isEditing}
                onChange={(birthday: Date) => setPersonalInfo({ ...personalInfo, birthday: birthday.getTime() })}
                dateFormat="dd.MM.yyyy"
              />
              <div className={styles.years}>
                ({age} years)
              </div>
            </div>
            <div className={styles.contactItem}>
              <FontAwesomeIcon icon={faHome} />
              <div
                id='address'
                onKeyDown={handleKeyDown}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e =>
                  setPersonalInfo({ ...personalInfo, address: e.target.innerText })
                }
              >
                {personalInfo.address}
              </div>
            </div>
            <div className={styles.contactItem}>
              <FontAwesomeIcon icon={faEnvelope} />
              <div
                id='email'
                onKeyDown={handleKeyDown}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e =>
                  setPersonalInfo({ ...personalInfo, email: e.target.innerText })
                }
              >
                {personalInfo.email}
              </div>
            </div>
            <div className={styles.contactItem}>
              <FontAwesomeIcon icon={faPhone} />
              <div
                id='phone'
                onKeyDown={handleKeyDown}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e =>
                  setPersonalInfo({ ...personalInfo, phone: e.target.innerText })
                }
              >
                {personalInfo.phone}
              </div>
            </div>
            <div className={styles.contactItem}>
              <ExternalLinks isEditing={isEditing} personalInfo={personalInfo} setter={setPersonalInfo}/>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <h2>
              <FontAwesomeIcon icon={faListAlt} />
              Summary
          </h2>
          <div className={styles.summary} onKeyDown={handleKeyDown}>
            {isEditing ? (
              <SimpleMDEEditor
                value={personalInfo.summary}
                onChange={value =>
                  setPersonalInfo({ ...personalInfo, summary: value })
                }
              />
            ) : (
              <DescriptionClamp styles={styles} showClamp={!forExport}>
                <Markdown>{personalInfo.summary}</Markdown>
              </DescriptionClamp>
            )}
          </div>
        </div>
      </div>
      {renderEdit()}
    </div>
  );
}