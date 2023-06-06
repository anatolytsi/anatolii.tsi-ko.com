import { useState } from "react";
import { AddSkill } from '@/components/resume/Skills';
import { IHobby, Hobby } from "./Hobby";
import { faMagic } from '@fortawesome/free-solid-svg-icons';

import styles from './Hobbies.module.scss';
import { ISkillsListProps } from "../Skills/Skill";
import { ICommonResumeSectionProps, sortByKey } from "../common";
import { compCreate, compDelete, compUpdate } from "../common/api-helpers";
import { CommonSection } from "../common/Section";

export interface IHobbiesListProps extends ISkillsListProps {}

const URL_PATH = 'hobbies';

export const HobbiesSection = ({ editModeEnabled, 
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
                       faIcon={faMagic}
                       sectionTitle={'Hobbies'}
                       editModeEnabled={editModeEnabled}/>
    );
}

export const HobbiesList = ({ data, editModeEnabled, sectionVisible }: IHobbiesListProps) => {
    const [hobbies, setHobbies] = useState<IHobby[]>(sortByKey(data, 'order', true));

    const handleUpdateHobby = (updatedHobby: IHobby) => {
        setHobbies((prevHobbies: IHobby[]) =>
            sortByKey(prevHobbies.map((hobby: IHobby) =>
                hobby._id === updatedHobby._id ? updatedHobby : hobby
            ), 'order', true)
        );
        compUpdate(URL_PATH, updatedHobby, updatedHobby._id);
    };

    const handleDeleteHobby = (hobbyId: string) => {
        compDelete(URL_PATH, hobbyId, (_response) => {
            setHobbies((hobbies: IHobby[]) => 
                hobbies.filter( el => el._id !== hobbyId )
            );
        });
    };

    const handleAddHobby = () => {
      let hobby: IHobby = {
        title: 'New hobby',
        order: 0,
        isVisible: false,
      }
      compCreate(URL_PATH, hobby, (response) => setHobbies([...hobbies, response.data]));
    };

    return (
        <div className={sectionVisible ? styles.hobbys : `${styles.hobbys} ${styles.sectionHidden}`}>
            <div
                className={styles.hobbysList}
            >
                {hobbies.map((hobby: IHobby, index: number) => (
                    <Hobby
                        key={hobby._id}
                        hobbyObj={hobby}
                        onUpdate={handleUpdateHobby}
                        onDelete={handleDeleteHobby}
                        editModeEnabled={editModeEnabled}
                        isLast={index === hobbies.length - 1}
                    />
                ))}
        
                <AddSkill 
                    handleAddSkill={handleAddHobby}
                    editModeEnabled={editModeEnabled}
                />
            </div>
        </div>
    );
};
