import { useState } from "react";

import styles from './Languages.module.scss';
import { GenericSkill, ISkill } from "../Skills";

export interface ILanguage extends ISkill {
    level: string
}

export interface ILanguageProps {
    languageObj: ILanguage
    onUpdate: any
    onDelete: any
    editModeEnabled: boolean
    isLast: boolean
} 

export const Language = ({ languageObj, onUpdate, onDelete, editModeEnabled, isLast }: ILanguageProps) => {
    const [language, setLanguage] = useState(languageObj);
    const [isEditing, setIsEditing] = useState(false);

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
            editModeEnabled={editModeEnabled}
            isLast={isLast}
            styles={styles}
            mainClsName={'language'}
            addInfoRenderer={renderLevel}
        />
    );
};
