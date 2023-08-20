import { useState } from 'react';

import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

import {Publication, IPublication} from './Publication';
import { ICommonResumeSectionProps, sortByKey } from '../common';

import styles from './Publication.module.scss';
import { compCreate, compDelete, compUpdate } from '../common/api-helpers';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';
import { CommonSection } from '../common/Section';

export const PublicationsSection = (props: ICommonResumeSectionProps) => {
    return (
        <CommonSection {...props} styles={styles} faIcon={faBookOpen} sectionTitle={'Publications'}/>
    );
}

const COMPONENT = 'resume';
const URL_PATH = 'publications';

export function PublicationsList({ data,
                                   editModeEnabled, 
                                   sectionVisible,
                                   forExport=false,
                                   shortVersion=false }: IExperienceListProps) {
  const [publications, setPublications] = useState<IPublication[]>(sortByKey(data, 'date', true));

  const handleUpdatePublication = (updatedPublication: IPublication) => {
    setPublications((prevPublications: IPublication[]) =>
      sortByKey(prevPublications.map((publication: IPublication) =>
        publication._id === updatedPublication._id ? updatedPublication : publication
      ), 'date', true)
    );
    compUpdate(COMPONENT, URL_PATH, updatedPublication, updatedPublication._id);
  };

  const handleDeletePublication = (publicationId: number) => {
    compDelete(COMPONENT, URL_PATH, publicationId, (_response) => {
      setPublications((publications: IPublication[]) => 
        publications.filter( el => el._id !== publicationId )
      );
    });
  };

  const handleAddPublication = () => {
    let publication: IPublication = {
      title: 'Article',
      conference: 'Conference',
      conferenceLink: 'http://conference.com',
      date: new Date().getTime(),
      isVisible: false,
    }
    compCreate(COMPONENT, URL_PATH, publication, (response) => setPublications([...publications, response.data]));
  };

  const expListProps: IExpListProps = {
    styles: styles,
    sectionVisible: sectionVisible,
    forExport: forExport,
    singlePage: shortVersion
  }

  return (
    <List {...expListProps}>

      {publications.map((publication: IPublication, index: number) => (
        <Publication
            key={publication._id}
            publication={publication}
            onUpdate={handleUpdatePublication}
            onDelete={handleDeletePublication}
            editModeEnabled={editModeEnabled}
            isLast={index === publications.length - 1}
            forExport={forExport}
            shortVersion={shortVersion}
        />
      ))}

      <AddNew
        editModeEnabled={editModeEnabled}
        handleAddExperience={handleAddPublication}
        styles={styles}
      />
    </List>
  );
}