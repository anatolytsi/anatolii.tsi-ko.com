import { useEffect, useState } from 'react';

import { Content, Dates, Description, EditableContent, Header, HeaderLine, Place, Title, Topic, WorkType, handleExpKeyDown } from '../Experience';
import styles from './Job.module.scss';
import { compUpdate } from '../common/api-helpers';
import { ICommonExperienceProps, IExperience } from '../Experience/common';

export interface IJobExperience extends IExperience {
  place: string
  placeLink?: string
  placeLocation?: string
  topic?: string
}

interface IJobExperienceProps {
  jobExperience: IJobExperience
  onUpdate: any
  onDelete: any
  editModeEnabled: boolean
  isLast: boolean
  forExport: boolean
}

export function JobExperience({ jobExperience, onUpdate, onDelete, editModeEnabled, isLast, forExport=false }: IJobExperienceProps) {
  const [experience, setExperience] = useState<IJobExperience>(jobExperience);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  useEffect(() => {
    compUpdate('jobExperience', experience, experience._id, (response) => onUpdate(response.data));
  }, [experience]);

  const handleSave = () => {
    setIsEditing(false);
    setExperience(experience);
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
            <div className={styles.titleWithType}>
              <Title {...expProps}/>
              <WorkType {...expProps}/>
            </div>
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
