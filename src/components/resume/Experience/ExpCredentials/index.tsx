import React from 'react';
import { ICommonExperienceProps } from '../common';

export const ExpCredentials = ({ styles,
                                 setter,
                                 keyDown,
                                 exp,
                                 isEditing=false }: ICommonExperienceProps) => {
    let credentials: JSX.Element;
    if (isEditing) {
      credentials = (
        <>
            <div className={styles.credentialId}>
                Credentials: 
                <span
                    id='credentialId'
                    suppressContentEditableWarning
                    contentEditable
                    onBlur={e =>
                        setter({ ...exp, credentialId: e.target.innerText })
                    }
                    onKeyDown={keyDown}
                >
                    {exp!.credentialId}
                </span>
            </div>
            <div className={styles.credentialLink}>
                Credentials Link: 
                <span
                    id='credentialLink'
                    suppressContentEditableWarning
                    contentEditable
                    onBlur={e =>
                        setter({ ...exp, credentialLink: e.target.innerText })
                    }
                    onKeyDown={keyDown}
                >
                    {exp!.credentialLink}
                </span>
            </div>
        </>
      );
    } else {
        credentials = (
            <>
                <div className={styles.credentialId}>
                    {exp!.credentialLink ? (
                        <a href={exp!.credentialLink}>
                            <h4>{exp!.credentialId}</h4>
                        </a>
                    ) : (
                        <h4>{exp!.credentialId}</h4>
                    )}
                </div>
            </>
        );
    }
    return credentials;
}