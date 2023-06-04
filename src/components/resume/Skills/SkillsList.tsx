import { useEffect, useState } from "react";
import { ISkillsListProps, ISkill, Skill, AddSkill } from "./Skill";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode } from '@fortawesome/free-solid-svg-icons';

import styles from './Skills.module.scss';
import { SectionControls, sortByKey } from "../common";
import { compCreate, compDelete } from "../common/api-helpers";

const URL_PATH = 'skills';

export const SkillsList = ({ data,
                             editModeEnabled, 
                             sectionName='skills',
                             sectionOrder=0,
                             sectionVisibility=true,
                             handleSectionVisibility=() => {}, 
                             handleSectionOrder=() => {} }: ISkillsListProps) => {
    let skillsObj = data;
    const [skills, setSkills] = useState<ISkill[]>(sortByKey(skillsObj, 'order', true));
    const visibilityState = useState(sectionVisibility);
    const orderingState = useState(sectionOrder);
  
    useEffect(() => {
      handleSectionVisibility(sectionName, visibilityState[0]);
    }, [visibilityState[0]]);
  
    useEffect(() => {
      handleSectionOrder(sectionName, orderingState[0]);
    }, [orderingState[0]]);

    const handleUpdateSkill = (updatedSkill: ISkill) => {
        setSkills((prevSkills: ISkill[]) =>
            sortByKey(prevSkills.map((skill: ISkill) =>
                skill._id === updatedSkill._id ? updatedSkill : skill
            ), 'order', true)
        );
    };

    const handleDeleteSkill = (skillId: number) => {
        compDelete(URL_PATH, skillId, (_response) => {
            setSkills((skills: ISkill[]) => 
                skills.filter( el => el._id !== skillId )
            );
        });
    };

    const handleAddSkill = () => {
      let skill: ISkill = {
        title: 'New skill',
        order: 0,
        isVisible: false,
      }
      compCreate(URL_PATH, skill, (response) => setSkills([...skills, response.data]));
    };

    return (
        <div className={visibilityState[0] ? styles.skills : `${styles.skills} ${styles.sectionHidden}`}>
            <SectionControls
                editModeEnabled={editModeEnabled}
                styles={styles}
                visibilityState={visibilityState}
                orderingState={orderingState}
            >
                <h2>
                    <FontAwesomeIcon icon={faLaptopCode} />
                    Skills
                </h2>
            </SectionControls>
            <div className={styles.skillsList}>
                <div>
                    {skills.map((skill: ISkill, index: number) => (
                        <Skill
                            key={skill._id}
                            skillObj={skill}
                            onUpdate={handleUpdateSkill}
                            onDelete={handleDeleteSkill}
                            editModeEnabled={editModeEnabled}
                            isLast={index === skills.length - 1}
                        />
                    ))}
                </div>
                <AddSkill 
                    handleAddSkill={handleAddSkill}
                    editModeEnabled={editModeEnabled}
                />
            </div>
        </div>
    );
};
