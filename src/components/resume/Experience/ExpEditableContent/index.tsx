import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ICommonExperienceProps, IExperience } from '../common';


interface ExperienceEditButtonProps {
    editModeEnabled?: boolean
    isEditing: boolean
    styles: any
    experience: IExperience
    setExperience?: any
    handleSave: any
    handleEdit: any
    onDelete?: any
}

export const ExperienceEditButton = ({ editModeEnabled,
                                       isEditing,
                                       styles,
                                       handleSave,
                                       handleEdit }: ExperienceEditButtonProps) => {
                                        
    if (editModeEnabled) {
        return (
            <button 
                type="button" 
                onClick={isEditing ? handleSave : handleEdit}
                className={isEditing ? `${styles.editButton} ${styles.isEditing}` : styles.editButton}
            >
                {isEditing ? (
                    <FontAwesomeIcon icon={faSave} />
                ) : (
                    <FontAwesomeIcon icon={faEdit} />
                )}
            </button>
        )
    } else {
        return <></>
    }
}

export const ExperienceControlButtons = ( props: ExperienceEditButtonProps) => {
    const { editModeEnabled,
            isEditing,
            styles,
            experience,
            setExperience,
            onDelete } = props;
    if (editModeEnabled) {
        return (
          <>
              <div
                className={styles.controls}
              >
                {isEditing ? (
                    ''
                ) : (
                    <button
                        type='button'
                        onClick={() => setExperience({ ...experience, isVisible: !experience.isVisible })}
                        className={styles.visibilityButton}
                    >
                        {experience.isVisible ? 
                            (
                                <FontAwesomeIcon icon={faEye} />
                            ) : (
                                <FontAwesomeIcon icon={faEyeSlash} />
                            )
                        }
                    </button>
                )}
                    <ExperienceEditButton {...props} />
                    {isEditing ? (
                        ''
                    ) : (
                        <>
                            <button 
                                type="button" 
                                onClick={() => onDelete(experience._id)}
                                className={styles.deleteButton}
                            >
                            <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </>
                    )}
              </div>
          </>
        );
    }
    return (<></>);
};


export const ExpEditableContent = ({ styles,
                                     exp,
                                     setter,
                                     saver,
                                     editor,
                                     deleter,
                                     children,
                                     editModeEnabled=false,
                                     isEditing=false }:ICommonExperienceProps) => {
    return (
        <div className={styles.editExperience}>
            <ExperienceControlButtons
                editModeEnabled={editModeEnabled}
                isEditing={isEditing}
                styles={styles}
                experience={exp!}
                setExperience={setter}
                handleSave={saver}
                handleEdit={editor}
                onDelete={deleter}
            />
            {children}
        </div>
    );
}