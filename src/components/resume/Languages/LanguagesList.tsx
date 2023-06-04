import { useEffect, useState } from "react";
import { AddSkill } from '@/components/resume/Skills';
import { ILanguage, Language } from "./Language";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';

import styles from './Languages.module.scss';
import { ISkillsListProps } from "../Skills/Skill";
import { SectionControls, sortByKey } from "../common";
import { compCreate, compDelete } from "../common/api-helpers";

export interface ILanguagesListProps extends ISkillsListProps {}

const URL_PATH = 'languages';

export const LanguagesList = ({ data,
                                editModeEnabled, 
                                key=0,
                                sectionName='languages',
                                sectionOrder=0,
                                sectionVisibility=true,
                                handleSectionVisibility=() => {}, 
                                handleSectionOrder=() => {} }: ILanguagesListProps) => {
    let languagesObj = data;
    const [languages, setLanguages] = useState<ILanguage[]>(sortByKey(languagesObj, 'order', true));
    const visibilityState = useState(sectionVisibility);
    const orderingState = useState(sectionOrder);
  
    useEffect(() => {
      handleSectionVisibility(sectionName, visibilityState[0]);
    }, [visibilityState[0]]);
  
    useEffect(() => {
      handleSectionOrder(sectionName, orderingState[0]);
    }, [orderingState[0]]);

    const handleUpdateLanguage = (updatedLanguage: ILanguage) => {
        setLanguages((prevLanguages: ILanguage[]) =>
            sortByKey(prevLanguages.map((language: ILanguage) =>
                language._id === updatedLanguage._id ? updatedLanguage : language
            ), 'order', true)
        );
    };

    const handleDeleteLanguage = (languageId: number) => {
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
        <div key={key} className={visibilityState[0] ? styles.languages : `${styles.languages} ${styles.sectionHidden}`}>
            <SectionControls
                editModeEnabled={editModeEnabled}
                styles={styles}
                visibilityState={visibilityState}
                orderingState={orderingState}
            >
                <h2>
                    <FontAwesomeIcon icon={faLanguage} />
                    Languages
                </h2>
            </SectionControls>
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
