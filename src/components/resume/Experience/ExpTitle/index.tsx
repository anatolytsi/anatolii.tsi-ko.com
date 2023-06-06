import React from 'react';
import { ICommonExperienceProps } from '../common';

export const ExpTitle = ({ styles, 
                           isEditing,
                           setter,
                           keyDown,
                           exp }: ICommonExperienceProps) => {
    return (
        <div className={styles.title}>
            <h3
                id='title'
                contentEditable={isEditing}
                onBlur={e =>
                    setter({ ...exp, title: e.target.innerText })
                }
                suppressContentEditableWarning
                onKeyDown={keyDown}
            >
                {exp?.title}
            </h3>
        </div>
    );
}
