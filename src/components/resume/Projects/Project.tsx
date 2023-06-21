import { useEffect, useState } from 'react';

import { Content, Dates, Description, EditableContent, Header, HeaderLine, Title, Website, Websites, handleExpKeyDown } from '../Experience';
import styles from './Project.module.scss';
import { ICommonExperienceProps, IExpWebsite, IExperience } from '../Experience/common';

export interface IProject extends IExperience {
  websites?: IExpWebsite[]
}

interface IProjectProps {
    project: IProject
    onUpdate: any
    onDelete: any
    editModeEnabled: boolean
    isLast: boolean
    forExport: boolean
    shortVersion?: boolean
}

export function Project({ project, onUpdate, onDelete, editModeEnabled, isLast, forExport=false, shortVersion=false }: IProjectProps) {
  const [experience, setExperience] = useState<IProject>(project);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [compUpdated, setcompUpdated] = useState<boolean>(false);

  const handleSetExperience = (exp: IExperience) => {
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
            <div className={editModeEnabled ? `${styles.titleAndWebsites} ${styles.editing}` : styles.titleAndWebsites}>
              <Title {...expProps}/>
              <Websites {...expProps}/>
            </div>
            <Dates {...expProps}/>
          </HeaderLine>
        </Header>
        {shortVersion ? '':
          <Description {...expProps}/>
        }
      </Content>
    </EditableContent>
  );
}
