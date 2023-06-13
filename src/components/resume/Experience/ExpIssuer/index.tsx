import React from 'react';
import { ICommonExperienceProps } from '../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export const ExpIssuer = ({ styles,
                           setter,
                           keyDown,
                           exp,
                           isEditing=false }: ICommonExperienceProps) => {
    let issuer: JSX.Element;
    if (isEditing) {
      issuer = (
        <>
            <div className={styles.issuer}>
                Issuer: 
                <span
                    id='issuer'
                    suppressContentEditableWarning
                    contentEditable
                    onBlur={e =>
                        setter({ ...exp, issuer: e.target.innerText })
                    }
                    onKeyDown={keyDown}
                >
                    {exp?.issuer}
                </span>
            </div>
            <div className={styles.issuerLink}>
                Issuer Link: 
                <span
                    id='issuerLink'
                    suppressContentEditableWarning
                    contentEditable
                    onBlur={e =>
                        setter({ ...exp, issuerLink: e.target.innerText })
                    }
                    onKeyDown={keyDown}
                >
                    {exp?.issuerLink}
                </span>
            </div>
        </>
      );
    } else {
        issuer = (
            <>
                <div className={styles.issuer}>
                    {exp?.issuerLink ? (
                        <a href={exp?.issuerLink}>
                            <h4>
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} size='xs' className={styles.inlineIconLeft} />
                                {exp?.issuer}
                            </h4>
                        </a>
                    ) : (
                        <h4>{exp?.issuer}</h4>
                    )}
                </div>
            </>
        );
    }
    return issuer;
}