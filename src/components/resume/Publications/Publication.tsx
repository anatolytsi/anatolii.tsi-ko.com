import { useEffect, useState } from 'react';

import { Content, Date, EditableContent, Header, HeaderLine, Title, Conference, handleExpKeyDown } from '../Experience';
import styles from './Publication.module.scss';
import { ICommonExperienceProps, IExperience } from '../Experience/common';

export interface IPublication extends IExperience {
  date: number
  conference: string
  conferenceLink: string
}

interface IPublicationProps {
    publication: IPublication
    onUpdate: any
    onDelete: any
    editModeEnabled: boolean
    isLast: boolean
    forExport: boolean
    shortVersion?: boolean
}

export function Publication({ publication, 
                              onUpdate, 
                              onDelete, 
                              editModeEnabled, 
                              isLast, 
                              forExport=false, 
                              shortVersion=false }: IPublicationProps) {
  const [experience, setExperience] = useState(publication);
  const [isEditing, setIsEditing] = useState(false);
  const [compUpdated, setcompUpdated] = useState<boolean>(false);

  const handleSetExperience = (exp: IPublication) => {
    setExperience(exp);
    setcompUpdated(true);
  }

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(experience)
  };

  useEffect(() => {
      if (isEditing || compUpdated) {
          handleSave();
      }
  }, [editModeEnabled]);

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave)
  };

  const expProps: ICommonExperienceProps = {
    styles: styles,
    isEditing: isEditing,
    setter: handleSetExperience,
    keyDown: () => {},
    exp: experience,
    forExport: forExport,
    isLast: isLast,
    editModeEnabled: editModeEnabled,
    saver: handleSave,
    editor: () => setIsEditing(true),
    deleter: onDelete
  }

  if (shortVersion && expProps.exp && experience.conferenceLink) {
    expProps.exp!.titleLink = experience.conferenceLink;
  }

  return (
    <EditableContent {...expProps}>
      <Content {...expProps}>
        <Header {...expProps}>
          <HeaderLine {...expProps}>
            <Title {...expProps}/>
            <Date {...expProps}/>
          </HeaderLine>
          {!shortVersion ? <Conference {...expProps}/> : <></>}
        </Header>
      </Content>
    </EditableContent>
  );
}
