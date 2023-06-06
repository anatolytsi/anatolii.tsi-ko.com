import { useState } from 'react';

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
}

export function Publication({ publication, onUpdate, onDelete, editModeEnabled, isLast, forExport=false }: IPublicationProps) {
  const [experience, setExperience] = useState(publication);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(experience)
  };

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave)
  };

  const expProps: ICommonExperienceProps = {
    styles: styles,
    isEditing: isEditing,
    setter: setExperience,
    keyDown: () => {},
    exp: experience,
    showClamp: !forExport,
    isLast: isLast,
    editModeEnabled: editModeEnabled,
    saver: handleSave,
    editor: () => setIsEditing(true),
    deleter: onDelete
  }

  return (
    <EditableContent {...expProps}>
      <Content {...expProps}>
        <Header {...expProps}>
          <HeaderLine {...expProps}>
            <Title {...expProps}/>
            <Date {...expProps}/>
          </HeaderLine>
          <Conference {...expProps}/>
        </Header>
      </Content>
    </EditableContent>
  );
}
