import React from 'react';
import { ICommonExperienceProps } from '../common';

export const ExpGrades = ({ styles,
                            setter,
                            keyDown,
                            exp,
                            isEditing=false,
                            shortVersion=false,
                            editModeEnabled=false  }:ICommonExperienceProps) => {
    if (shortVersion) return <></>;
    
    if (exp?.grades || isEditing) {
        return (
            <div className={editModeEnabled ? `${styles.grades} ${styles.editing}` : styles.grades}>
                Grade: 
                <span
                    id='grades'
                    contentEditable={isEditing}
                    onKeyDown={keyDown}
                    onBlur={e =>
                        setter({
                            ...exp,
                            grade: e.target.innerText,
                        })
                    }
                    suppressContentEditableWarning
                >
                    {exp?.grades}
                </span>
            </div>
        );
    }
    return <></>;
}
