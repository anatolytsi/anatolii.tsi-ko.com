import React from 'react';
import { ICommonExperienceProps } from '../common';

export const ExpWorkType = ({ styles,
                              setter,
                              keyDown,
                              exp,
                              isEditing=false }: ICommonExperienceProps) => {
    if (exp?.workType || isEditing) {
        return (
            <div className={styles.workType}>
                (<span
                    id='workType'
                    contentEditable={isEditing}
                    onKeyDown={keyDown}
                    onBlur={e =>
                        setter({...exp, workType: e.target.innerText,})
                    }
                    suppressContentEditableWarning
                >
                    {exp?.workType}
                </span>)
            </div>
        );
    }
    return <></>;
}