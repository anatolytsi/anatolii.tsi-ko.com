import { useEffect, useState } from 'react';

import { Content, Dates, Description, EditableContent, Header, HeaderLine, Place, Title, Topic, handleExpKeyDown } from '../Experience';
import styles from './Internship.module.scss';
import { ICommonExperienceProps, IExperience } from '../Experience/common';

export interface IInternship extends IExperience {
    place: string
    placeLink?: string
    placeLocation?: string
    topic?: string
}

interface IInternshipProps {
    internship: IInternship
    onUpdate: any
    onDelete: any
    editModeEnabled: boolean
    isLast: boolean
    forExport: boolean
}

export function Internship({ internship, onUpdate, onDelete, editModeEnabled, isLast, forExport=false }: IInternshipProps) {
  const [experience, setExperience] = useState(internship);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(experience)
  };

  useEffect(() => {
      if (isEditing) {
          handleSave();
      }
  }, [editModeEnabled]);

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave)
  };

  const expProps: ICommonExperienceProps = {
    styles: styles,
    isEditing: isEditing,
    setter: setExperience,
    keyDown: () => {},
    exp: experience,
    forExport: forExport,
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
            <Dates {...expProps}/>
          </HeaderLine>
          <Place {...expProps}/>
          <Topic {...expProps}/>
        </Header>
        <Description {...expProps}/>
      </Content>
    </EditableContent>
  );
}
