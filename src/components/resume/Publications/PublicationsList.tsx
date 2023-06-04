import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

import {Publication, IPublication} from './Publication';
import { sortByKey } from '../common';

import styles from './Publication.module.scss';
import { compCreate, compDelete } from '../common/api-helpers';
import { AddNew, IExpListProps, IExperienceListProps, List } from '../Experience';

const URL_PATH = 'publications';

export function PublicationsList({ data,
                                    editModeEnabled, 
                                    key=0,
                                    forExport=false,
                                    sectionName='publications',
                                    sectionOrder=0,
                                    sectionVisibility=true,
                                    handleSectionVisibility=() => {}, 
                                    handleSectionOrder=() => {} }: IExperienceListProps) {
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

  const expListProps: IExpListProps = {
    styles: styles,
    editModeEnabled: editModeEnabled,
    visibilityState: visibilityState,
    orderingState: orderingState,
    faIcon: faBookOpen,
    sectionTitle: 'Publications'
  }

  return (
    <List key={key} {...expListProps}>

      {publications.map((publication: IPublication, index: number) => (
        <Publication
            key={publication._id}
            publication={publication}
            onUpdate={handleUpdatePublication}
            onDelete={handleDeletePublication}
            editModeEnabled={editModeEnabled}
            isLast={index === publications.length - 1}
            forExport={forExport}
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