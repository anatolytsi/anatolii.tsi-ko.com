import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChain, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { ICommonExperienceProps } from '../common';

export const ExpConference = ({ styles,
                           setter,
                           keyDown,
                           exp,
                           isEditing=false }: ICommonExperienceProps) => {
    let conference: JSX.Element;
    if (isEditing) {
      conference = (
        <>
            <div className={styles.conference}>
                Conference: 
                <span
                    id='conference'
                    suppressContentEditableWarning
                    contentEditable
                    onBlur={e =>
                        setter({ ...exp, conference: e.target.innerText })
                    }
                    onKeyDown={keyDown}
                >
                    {exp?.conference}
                </span>
            </div>
            <div className={styles.conferenceLink}>
                Conference Link: 
                <span
                    id='conferenceLink'
                    suppressContentEditableWarning
                    contentEditable
                    onBlur={e =>
                        setter({ ...exp, conferenceLink: e.target.innerText })
                    }
                    onKeyDown={keyDown}
                >
                    {exp?.conferenceLink}
                </span>
            </div>
        </>
      );
    } else {
        conference = (
            <>
                <div className={styles.conference}>
                    {exp?.conferenceLink ? (
                        <a href={exp?.conferenceLink}>
                            <h4>
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} size='xs' className={styles.inlineIconLeft} />
                                {exp?.conference}
                            </h4>
                        </a>
                    ) : (
                        <h4>{exp?.conference}</h4>
                    )}
                </div>
            </>
        );
    }
    return conference;
}