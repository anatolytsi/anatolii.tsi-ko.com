import { useEffect, useState } from "react";
import { ISkillsListProps,  ISimpleSkills } from "./Skill";
import { faLaptopCode } from '@fortawesome/free-solid-svg-icons';

import styles from './Skills.module.scss';
import { ICommonResumeSectionProps } from "../common";
import { compUpdate } from "../common/api-helpers";
import { Description } from "../Experience";
import { EditButton } from "../PersonalInfo/EditButton";
import { CommonSection } from "../common/Section";

export const SkillsSection = (props: ICommonResumeSectionProps) => {
    return (
        <CommonSection {...props} styles={styles} faIcon={faLaptopCode} sectionTitle={'Skills'}/>
    );
}

export const SkillsList = ({ data, editModeEnabled, sectionVisible, shortVersion=false }: ISkillsListProps) => {
    const [skills, setSkills] = useState<ISimpleSkills>(data);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        compUpdate('skills', skills, skills._id, () => setSkills(skills));
    };

    useEffect(() => {
        if (isEditing) {
            handleSave();
        }
    }, [editModeEnabled]);

    return (
        <div className={`${styles.skillsList} ${sectionVisible ? '' : styles.sectionHidden} ${shortVersion ? styles.singlePage : ''}`}>
            <div className={editModeEnabled ? `${styles.skills} ${styles.editing}` : styles.skills}>
                <EditButton isEditing={isEditing} styles={styles} setSave={handleSave} setEdit={handleEdit} editModeEnabled={editModeEnabled}/>
                <Description styles={styles} isEditing={isEditing} forExport={true} exp={skills} setter={setSkills}/>
            </div>
        </div>
    );
};
