import React from 'react';
import { ICommonExperienceProps } from '../common';

export const ExpGrades = ({ styles,
                            setter,
                            keyDown,
                            exp,
                            isEditing=false }:ICommonExperienceProps) => {
    if (exp!.grades || isEditing) {
        return (
            <div className={styles.grades}>
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
                    {exp!.grades}
                </span>
            </div>
        );
    }
    return <></>;
}
