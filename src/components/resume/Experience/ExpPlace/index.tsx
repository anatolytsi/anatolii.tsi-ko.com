import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { ICommonExperienceProps } from '../common';

export const ExpPlace = ({ styles,
                           setter,
                           keyDown,
                           exp,
                           isEditing=false,
                           shortVersion=false }: ICommonExperienceProps) => {
    let place: JSX.Element;
    if (isEditing) {
      place = (
        <>
            <div className={styles.place}>
                Place: 
                <span
                    id='place'
                    suppressContentEditableWarning
                    contentEditable
                    onBlur={e =>
                        setter({ ...exp, place: e.target.innerText })
                    }
                    onKeyDown={keyDown}
                >
                    {exp?.place}
                </span>
            </div>
            <div className={styles.placeLink}>
                Place Link: 
                <span
                    id='placeLink'
                    suppressContentEditableWarning
                    contentEditable
                    onBlur={e =>
                        setter({ ...exp, placeLink: e.target.innerText })
                    }
                    onKeyDown={keyDown}
                >
                    {exp?.placeLink}
                </span>
            </div>
            <div className={styles.placeLocation}>
                Place Location:
                <span
                    id='placeLocation'
                    contentEditable={isEditing}
                    onBlur={e =>
                        setter({
                            ...exp,
                            placeLocation: e.target.innerText,
                        })
                    }
                    onKeyDown={keyDown}
                    suppressContentEditableWarning
                >
                    {exp?.placeLocation}
                </span>
            </div>
        </>
      );
    } else {
        place = (
            <div className={styles.placeAndLocation}>
                <div className={styles.place}>
                    {exp?.placeLink ? (
                        <a href={exp?.placeLink}>
                            <h4>
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} size='xs' className={styles.inlineIconLeft} />
                                {exp?.place}
                            </h4>
                        </a>
                    ) : (
                        <h4>{exp?.place}</h4>
                    )}
                </div>
                {shortVersion ? <></> :
                    <div id='placeLocation' className={styles.placeLocation}>
                        {exp?.placeLocation}
                    </div>
                }
            </div>
        );
    }
    return place;
}