import { useState } from "react";
import { AddSkill } from '@/components/resume/Skills';
import { ILanguage, Language } from "./Language";
import { faLanguage } from '@fortawesome/free-solid-svg-icons';

import styles from './Languages.module.scss';
import { ISkillsListProps } from "../Skills/Skill";
import { ICommonResumeSectionProps, sortByKey } from "../common";
import { compCreate, compDelete, compUpdate } from "../common/api-helpers";
import { CommonSection } from '../common/Section';

export const LanguagesSection = (props: ICommonResumeSectionProps) => {
    return (
        <CommonSection {...props} styles={styles} faIcon={faLanguage} sectionTitle={'Languages'}/>
    );
}

export interface ILanguagesListProps extends ISkillsListProps {}

const URL_PATH = 'languages';

export const LanguagesList = ({ data, editModeEnabled, sectionVisible }: ILanguagesListProps) => {
    let languagesObj = data;
    const [languages, setLanguages] = useState<ILanguage[]>(sortByKey(languagesObj, 'order', true));

    const handleUpdateLanguage = (updatedLanguage: ILanguage) => {
        setLanguages((prevLanguages: ILanguage[]) =>
            sortByKey(prevLanguages.map((language: ILanguage) =>
                language._id === updatedLanguage._id ? updatedLanguage : language
            ), 'order', true)
        );
        compUpdate(URL_PATH, updatedLanguage, updatedLanguage._id);
    };

    const handleDeleteLanguage = (languageId: string) => {
        compDelete(URL_PATH, languageId, (_response) => {
            setLanguages((languages: ILanguage[]) => 
                languages.filter( el => el._id !== languageId )
            );
        });
    };

    const handleAddLanguage = () => {
      let language: ILanguage = {
        title: 'New language',
        order: 0,
        level: 'Level',
        isVisible: false,
      }
      compCreate(URL_PATH, language, (response) => setLanguages([...languages, response.data]));
    };

    return (
        <div className={sectionVisible ? styles.languages : `${styles.languages} ${styles.sectionHidden}`}>
            <div
                className={styles.languagesList}
            >
                {languages.map((language: ILanguage, index: number) => (
                    <Language
                        key={language._id}
                        languageObj={language}
                        onUpdate={handleUpdateLanguage}
                        onDelete={handleDeleteLanguage}
                        editModeEnabled={editModeEnabled}
                        isLast={index === languages.length - 1}
                    />
                ))}
        
                <AddSkill 
                    handleAddSkill={handleAddLanguage}
                    editModeEnabled={editModeEnabled}
                />
            </div>
        </div>
    );
};
