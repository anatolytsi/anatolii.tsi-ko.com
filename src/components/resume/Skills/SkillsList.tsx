import { useState } from "react";
import { ISkillsListProps,  ISimpleSkills } from "./Skill";
import { faLaptopCode } from '@fortawesome/free-solid-svg-icons';

import styles from './Skills.module.scss';
import { ICommonResumeSectionProps } from "../common";
import { compUpdate } from "../common/api-helpers";
import { Description } from "../Experience";
import { EditButton } from "../PersonalInfo/EditButton";
import { CommonSection } from "../common/Section";

export const SkillsSection = ({ editModeEnabled, 
                                sectionName,
                                order,
                                isVisible,
                                orderSetter,
                                visibilitySetter }: ICommonResumeSectionProps) => {
    return (
        <CommonSection styles={styles}
                       sectionName={sectionName}
                       order={order}
                       isVisible={isVisible}
                       orderSetter={orderSetter}
                       visibilitySetter={visibilitySetter}
                       faIcon={faLaptopCode}
                       sectionTitle={'Skills'}
                       editModeEnabled={editModeEnabled}/>
    );
}

export const SkillsList = ({ data, editModeEnabled, sectionVisible }: ISkillsListProps) => {
    const [skills, setSkills] = useState<ISimpleSkills>(data);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        compUpdate('skills', skills, skills._id, () => setSkills(skills));
    };

    return (
        <div className={sectionVisible ? styles.skills : `${styles.skills} ${styles.sectionHidden}`}>
            <div className={styles.editing}>
                <EditButton isEditing={isEditing} styles={styles} setSave={handleSave} setEdit={handleEdit} editModeEnabled={editModeEnabled}/>
                <Description styles={styles} isEditing={isEditing} showClamp={false} exp={skills} setter={setSkills}/>
            </div>
        </div>
    );
};
