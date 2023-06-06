import { useEffect, useState } from "react";
import { ISkillsListProps,  ISimpleSkills } from "./Skill";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode } from '@fortawesome/free-solid-svg-icons';

import styles from './Skills.module.scss';
import { SectionControls } from "../common";
import { compUpdate } from "../common/api-helpers";
import { Description } from "../Experience";
import { EditButton } from "../PersonalInfo/EditButton";


export const SkillsList = ({ data,
                             editModeEnabled, 
                             sectionName='skills',
                             sectionOrder=0,
                             sectionVisibility=true,
                             handleSectionVisibility=() => {}, 
                             handleSectionOrder=() => {} }: ISkillsListProps) => {
    const [skills, setSkills] = useState<ISimpleSkills>(data);
    const [isEditing, setIsEditing] = useState(false);
    const visibilityState = useState(sectionVisibility);
    const orderingState = useState(sectionOrder);
  
    useEffect(() => {
      handleSectionVisibility(sectionName, visibilityState[0]);
    }, [visibilityState[0]]);
  
    useEffect(() => {
      handleSectionOrder(sectionName, orderingState[0]);
    }, [orderingState[0]]);
  
    useEffect(() => {
      compUpdate('skills', skills, skills._id, (response) => setSkills(skills));
    }, [skills]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        setSkills(skills);
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
            <div className={styles.editing}>
                <EditButton isEditing={isEditing} styles={styles} setSave={handleSave} setEdit={handleEdit} editModeEnabled={editModeEnabled}/>
                {/* {skills.description} */}
                <Description styles={styles} isEditing={isEditing} showClamp={false} exp={skills} setter={setSkills}/>
            </div>
        </div>
    );
};
