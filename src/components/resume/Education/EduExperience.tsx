import { useEffect, useState } from 'react';

import { Content, Dates, Description, EditableContent, Grades, Header, HeaderLine, Place, Title, Topic, handleExpKeyDown } from '../Experience';
import styles from './Education.module.scss';
import { compUpdate } from '../common/api-helpers';
import { ICommonExperienceProps, IExperience } from '../Experience/common';

export interface IEduExperience extends IExperience {
    place: string
    placeLink?: string
    placeLocation?: string
    grade?: string
    topic?: string
}

interface IEduExperienceProps {
    eduExperience: IEduExperience
    onUpdate: any
    onDelete: any
    editModeEnabled: boolean
    isLast: boolean
    forExport: boolean
}

export function EduExperience({ eduExperience, onUpdate, onDelete, editModeEnabled, isLast, forExport=false }: IEduExperienceProps) {
  const [experience, setExperience] = useState(eduExperience);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
      compUpdate('education', experience, experience._id, (response) => onUpdate(response.data));
  }, [experience]);

  const handleSave = () => {
    setIsEditing(false);
    setExperience(experience)
  };

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave);
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
            <Dates {...expProps}/>
          </HeaderLine>
          <Place {...expProps}/>
          <Topic {...expProps}/>
          <Grades {...expProps}/>
        </Header>
        <Description {...expProps}/>
      </Content>
    </EditableContent>
  );
}
