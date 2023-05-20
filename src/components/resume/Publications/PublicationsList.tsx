import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

import {Publication, IPublication} from './Publication';
import { AddExperience, ExperienceListProps } from '../Experience';

import styles from './Publication.module.scss';
import { SectionControls, sortByKey } from '../common';
import { compCreate, compDelete } from '../common/api-helpers';

interface PublicationListProps extends ExperienceListProps {};

const URL_PATH = 'publications';

export function PublicationsList({ data,
                                    isAdmin, 
                                    key=0,
                                    forExport=false,
                                    sectionName='publications',
                                    sectionOrder=0,
                                    sectionVisibility=true,
                                    handleSectionVisibility=() => {}, 
                                    handleSectionOrder=() => {} }: PublicationListProps) {
  const [publications, setPublications] = useState<IPublication[]>(sortByKey(data, 'date', true));
  const visibilityState = useState(sectionVisibility);
  const orderingState = useState(sectionOrder);

  useEffect(() => {
    handleSectionVisibility(sectionName, visibilityState[0]);
  }, [visibilityState[0]]);

  useEffect(() => {
    handleSectionOrder(sectionName, orderingState[0]);
  }, [orderingState[0]]);

  const handleUpdatePublication = (updatedPublication: IPublication) => {
    setPublications((prevPublications: IPublication[]) =>
      sortByKey(prevPublications.map((publication: IPublication) =>
        publication._id === updatedPublication._id ? updatedPublication : publication
      ), 'date', true)
    );
  };

  const handleDeletePublication = (publicationId: number) => {
    compDelete(URL_PATH, publicationId, (_response) => {
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
    compCreate(URL_PATH, publication, (response) => setPublications([...publications, response.data]));
  };

  return (
    <div key={key}
      className={visibilityState[0] ? styles.publicationList : `${styles.publicationList} ${styles.sectionHidden}`}
    >
      <SectionControls
        isAdmin={isAdmin}
        styles={styles}
        visibilityState={visibilityState}
        orderingState={orderingState}
      >
        <h2>
            <FontAwesomeIcon icon={faBookOpen} />
            Publications
        </h2>
      </SectionControls>
      {publications.map((publication: IPublication, index: number) => (
        <Publication
            key={publication._id}
            publication={publication}
            onUpdate={handleUpdatePublication}
            onDelete={handleDeletePublication}
            isAdmin={isAdmin}
            isLast={index === publications.length - 1}
            forExport={forExport}
        />
      ))}

      <AddExperience
        isAdmin={isAdmin}
        handleAddExperience={handleAddPublication}
        styles={styles}
      />
    </div>
  );
}