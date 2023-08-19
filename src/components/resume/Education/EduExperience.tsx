import { useEffect, useState } from 'react';

import { Content, Dates, Description, EditableContent, Grades, Header, HeaderLine, Place, Title, Topic, handleExpKeyDown } from '../Experience';
import styles from './Education.module.scss';
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
    shortVersion?: boolean
}

export function EduExperience({ eduExperience, onUpdate, onDelete, editModeEnabled, isLast, forExport=false, shortVersion=false }: IEduExperienceProps) {
  const [experience, setExperience] = useState(eduExperience);
  const [isEditing, setIsEditing] = useState(false);
  const [compUpdated, setcompUpdated] = useState<boolean>(false);

  const handleSetExperience = (exp: IEduExperience) => {
    setExperience(exp);
    setcompUpdated(true);
  }

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(experience);
  };

  useEffect(() => {
      if (isEditing || compUpdated) {
          handleSave();
      }
  }, [editModeEnabled]);

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave);
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
    deleter: onDelete,
    shortVersion: shortVersion
  }

  const getAbbreviation = (str: string | undefined) => {
    let output = '';
    if (!str) return output;
    output = str.match(/[A-Z]/g)?.join('') ?? '';
    if (output) output = ` (${output})`;
    return output;
  }

  if (shortVersion && expProps.exp && experience.placeLink) {
    expProps.exp!.titleAdd = getAbbreviation(eduExperience.place);
    expProps.exp!.titleLink = experience.placeLink;
  }

  return (
    <EditableContent {...expProps}>
      <Content {...expProps}>
        <Header {...expProps}>
          <HeaderLine {...expProps}>
            <Title {...expProps}/>
            <Dates {...expProps}/>
          </HeaderLine>
          {!shortVersion ? <Place {...expProps}/> : <></>}
          <div className={editModeEnabled ? `${styles.gradesAndTopic} ${styles.editing}` : styles.gradesAndTopic}>
            <Grades {...expProps}/>
            <Topic {...expProps}/>
          </div>
        </Header>
        <Description {...expProps}/>
      </Content>
    </EditableContent>
  );
}
