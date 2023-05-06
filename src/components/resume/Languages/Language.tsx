import { useEffect, useRef, useState } from "react";
import axios from 'axios';

import styles from './Languages.module.scss';
import { GenericSkill, ISkill } from "../Skills";
import { compUpdate } from "../common/api-helpers";
import { WAIT_EFFECT } from "../common";

export interface ILanguage extends ISkill {
    level: string
}

export interface ILanguageProps {
    languageObj: ILanguage
    onUpdate: any
    onDelete: any
    isAdmin: boolean
    isLast: boolean
} 

export const Language = ({ languageObj, onUpdate, onDelete, isAdmin, isLast }: ILanguageProps) => {
    const [language, setLanguage] = useState(languageObj);
    const [isEditing, setIsEditing] = useState(false);
    const firstUpdate = useRef(WAIT_EFFECT);
  
    useEffect(() => {
      if (firstUpdate.current) {
        firstUpdate.current--;
        return;
      }
      compUpdate('languages', language, language._id, (response) => onUpdate(response.data));
    }, [language]);

    const renderLevel = () => {
        if (language.level) {
            return (
                <>
                    <span className={styles.dash}>
                        -
                    </span>
                    <div
                        className={styles.level}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={e =>
                            setLanguage({ ...language, level: e.target.innerText })
                        }
                    >
                        {language.level}
                    </div>
                </>
            );
        }
    };

    return (
        <GenericSkill
            skill={language}
            setSkill={setLanguage}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isAdmin={isAdmin}
            isLast={isLast}
            styles={styles}
            mainClsName={'language'}
            addInfoRenderer={renderLevel}
        />
    );
};
