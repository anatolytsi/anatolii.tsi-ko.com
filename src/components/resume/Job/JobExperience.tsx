import { useEffect, useState } from 'react';

import { Content, Dates, Description, EditableContent, Header, HeaderLine, Place, Title, Topic, WorkType, handleExpKeyDown } from '../Experience';
import styles from './Job.module.scss';
import { ICommonExperienceProps, IExperience, IExperienceProps } from '../Experience/common';

export interface IJobExperience extends IExperience {
  place: string
  placeLink?: string
  placeLocation?: string
  topic?: string
}

interface IJobExperienceProps extends IExperienceProps {
  experience: IJobExperience
  onUpdate: any
  onDelete: any
  editModeEnabled: boolean
  isLast: boolean
  forExport: boolean
  shortVersion?: boolean
}

export function JobExperience({ experience: jobExperience, onUpdate, onDelete, editModeEnabled, isLast, forExport=false, shortVersion=false }: IJobExperienceProps) {
  const [experience, setExperience] = useState<IJobExperience>(jobExperience);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [compUpdated, setcompUpdated] = useState<boolean>(false);

  const handleSetExperience = (exp: IJobExperience) => {
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
    deleter: onDelete,
    shortVersion: shortVersion
  }

  return (
    <EditableContent {...expProps}>
      <Content {...expProps}>
        <Header {...expProps}>
          <HeaderLine {...expProps}>
            <div>
              <div className={styles.titleWithType}>
                <Title {...expProps}/>
                <WorkType {...expProps}/>
              </div>
              <Place {...expProps}/>
            </div>
            <Dates {...expProps}/>
          </HeaderLine>
          <Topic {...expProps}/>
        </Header>
        <Description {...expProps} shortVersion={shortVersion && !!(experience.topic?.length)}/>
      </Content>
    </EditableContent>
  );
}
