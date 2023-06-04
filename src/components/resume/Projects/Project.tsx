import { useEffect, useState } from 'react';

import { Content, Dates, Description, EditableContent, Header, HeaderLine, Title, Website, Websites, handleExpKeyDown } from '../Experience';
import styles from './Project.module.scss';
import { compUpdate } from '../common/api-helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
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
}

export function Project({ project, onUpdate, onDelete, editModeEnabled, isLast, forExport=false }: IProjectProps) {
  const [experience, setExperience] = useState<IProject>(project);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  useEffect(() => {
    compUpdate('projects', experience, experience._id, (response) => onUpdate(response.data));
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
            <Title {...expProps}/>
            <Dates {...expProps}/>
          </HeaderLine>
          <Websites {...expProps}/>
        </Header>
        <Description {...expProps}/>
      </Content>
    </EditableContent>
  );
}
