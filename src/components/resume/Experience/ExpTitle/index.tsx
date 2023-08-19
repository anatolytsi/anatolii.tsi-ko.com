import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { ICommonExperienceProps } from '../common';


export const ExpTitle = ({ styles, 
                           isEditing,
                           setter,
                           keyDown,
                           exp }: ICommonExperienceProps) => {
    return (
        <div className={styles.title}>
            {exp?.titleLink 
                ?
                <a href={exp?.titleLink} target="_blank">
                    <h3
                        id='title'
                        contentEditable={isEditing}
                        onBlur={e =>
                            setter({ ...exp, title: e.target.innerText })
                        }
                        suppressContentEditableWarning
                        onKeyDown={keyDown}
                    >
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} size='xs' className={styles.inlineIconLeft} />
                        {exp?.title}{exp?.titleAdd}
                    </h3>
                </a>
                :
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
            }
        </div>
    );
}
