import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEdit, faSave, faTrash, faPlusCircle, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import styles from './Skills.module.scss';
import { IResumeSectionComponent, WAIT_EFFECT } from "../common";
import { compUpdate } from "../common/api-helpers";

export interface ISkill {
    _id?: number
    title: string
    order: number
    isVisible: boolean
}

export interface ISkillProps {
    skillObj: ISkill
    onUpdate: any
    onDelete: any
    isAdmin: boolean
    isLast: boolean
} 

export interface ISkillsListProps extends IResumeSectionComponent {}

export interface IGenericSkillProps {
    skill: ISkill
    setSkill: any
    isEditing: boolean
    setIsEditing: any
    onUpdate: any
    onDelete: any
    isAdmin: boolean
    isLast: boolean
    styles: any
    mainClsName: string
    addInfoRenderer?: any
}

interface IAddSkillProps {
    isAdmin: boolean
    handleAddSkill: any
}

export const AddSkill = ({isAdmin, handleAddSkill}: IAddSkillProps) => {

    return (
        <>
        {isAdmin ?
            <button
                type='button'
                onClick={handleAddSkill}
                className={styles.skillAdd}
            >
                <FontAwesomeIcon icon={faPlusCircle} />
            </button>
        : ''}
        </>
    )
};

export const GenericSkill = ({ skill, 
                               setSkill,
                               isEditing, 
                               setIsEditing, 
                               onUpdate, 
                               onDelete, 
                               isAdmin, 
                               isLast, 
                               styles, 
                               mainClsName, 
                               addInfoRenderer=() => {} }: IGenericSkillProps) => {
    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        onUpdate(skill);
    };

    const getSkillStyle = () => {
        let className = `${styles[mainClsName]} ${isLast ? styles.last : ''}`;
        className = `${className} ${skill.isVisible ? '' : styles.hidden}`
        return className;
    }

    const reorderSkill = (incrBy: number) => {
        let updatedSkill: ISkill = { ...skill, order: skill.order + incrBy };
        setSkill(updatedSkill);
        onUpdate(updatedSkill);
    };

    const renderControls = () => {
        if (isAdmin) {
            return (
                <div
                    className={styles.controls}
                >
                    {isEditing ? (
                        <button 
                            type="button" 
                            onClick={handleSave}
                            className={`${styles.editButton} ${styles.isEditing}`}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    ) : (
                        <>
                            <button
                                type='button'
                                onClick={() => setSkill({ ...skill, isVisible: !skill.isVisible })}
                                className={styles.visibilityButton}
                            >
                                {skill.isVisible ? 
                                    (
                                        <FontAwesomeIcon icon={faEye} />
                                    ) : (
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                    )
                                }
                            </button>
                            <button 
                                type="button" 
                                onClick={() => reorderSkill(1)}
                                className={styles.editButton}
                            >
                                <FontAwesomeIcon icon={faArrowUp} />
                            </button>
                            <button 
                                type="button" 
                                onClick={() => reorderSkill(-1)}
                                className={styles.editButton}
                            >
                                <FontAwesomeIcon icon={faArrowDown} />
                            </button>
                            <button 
                                type="button" 
                                onClick={handleEdit}
                                className={styles.editButton}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button 
                                type="button" 
                                onClick={() => onDelete(skill._id)}
                                className={styles.deleteButton}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </>
                    )}

                </div>
            );
        }
        return <></>;
    }

    return (
        <div
            className={getSkillStyle()}
        >
            <div
                className={styles.title}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e =>
                    setSkill({ ...skill, title: e.target.innerText })
                }
            >
                {skill.title}
            </div>
            {addInfoRenderer()}
            {renderControls()}
        </div>
    );
}

export const Skill = ({ skillObj, onUpdate, onDelete, isAdmin, isLast }: ISkillProps) => {
    const [skill, setSkill] = useState(skillObj);
    const [isEditing, setIsEditing] = useState(false);
    const firstUpdate = useRef(WAIT_EFFECT);
  
    useEffect(() => {
      if (firstUpdate.current) {
        firstUpdate.current--;
        return;
      }
      compUpdate('skills', skill, skill._id, (response) => onUpdate(response.data));
    }, [skill]);

    return (
        <GenericSkill
            skill={skill}
            setSkill={setSkill}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isAdmin={isAdmin}
            isLast={isLast}
            styles={styles}
            mainClsName={'skill'}
        />
    );
};
