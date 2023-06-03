import React from 'react';
import { ICommonExperienceProps } from '../common';

export const ExpTopic = ({ styles,
                           setter,
                           keyDown,
                           exp,
                           isEditing=false }: ICommonExperienceProps) => {
    if (exp!.topic || isEditing) {
        return (
            <div className={styles.topic}>
                Topic: 
                <span
                    id='topic'
                    contentEditable={isEditing}
                    onKeyDown={keyDown}
                    onBlur={e =>
                        setter({...exp, topic: e.target.innerText,})
                    }
                    suppressContentEditableWarning
                >
                    {exp!.topic}
                </span>
            </div>
        );
    }
    return <></>;
}