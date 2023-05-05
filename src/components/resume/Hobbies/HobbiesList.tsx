import { useEffect, useState } from "react";
import { AddSkill } from '@/components/resume/Skills';
import { IHobby, Hobby } from "./Hobby";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic } from '@fortawesome/free-solid-svg-icons';

import styles from './Hobbies.module.scss';
import { ISkillsListProps } from "../Skills/Skill";
import { SectionControls, sortByKey } from "../common";
import { compCreate, compDelete } from "../common/api-helpers";

export interface IHobbiesListProps extends ISkillsListProps {}

const URL_PATH = 'hobbies';

export const HobbiesList = ({ data,
                              isAdmin, 
                              key=0,
                              sectionName='hobbies',
                              sectionOrder=0,
                              sectionVisibility=true,
                              handleSectionVisibility=() => {}, 
                              handleSectionOrder=() => {} }: IHobbiesListProps) => {
    let hobbiesObj = data;
    if (!isAdmin) {
        hobbiesObj = hobbiesObj.filter((el: IHobby) => el.isVisible);
    }
    const [hobbies, setHobbies] = useState<IHobby[]>(sortByKey(hobbiesObj, 'order', true));
    const visibilityState = useState(sectionVisibility);
    const orderingState = useState(sectionOrder);
  
    useEffect(() => {
      handleSectionVisibility(sectionName, visibilityState[0]);
    }, [visibilityState[0]]);
  
    useEffect(() => {
      handleSectionOrder(sectionName, orderingState[0]);
    }, [orderingState[0]]);

    const handleUpdateHobby = (updatedHobby: IHobby) => {
        setHobbies((prevHobbies: IHobby[]) =>
            sortByKey(prevHobbies.map((hobby: IHobby) =>
                hobby._id === updatedHobby._id ? updatedHobby : hobby
            ), 'order', true)
        );
    };

    const handleDeleteHobby = (hobbyId: number) => {
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
        <div key={key} className={visibilityState[0] ? styles.hobbys : `${styles.hobbys} ${styles.sectionHidden}`}>
            <SectionControls
                isAdmin={isAdmin}
                styles={styles}
                visibilityState={visibilityState}
                orderingState={orderingState}
            >
                <h2>
                    <FontAwesomeIcon icon={faMagic} />
                    Hobbies
                </h2>
            </SectionControls>
            <div
                className={styles.hobbysList}
            >
                {hobbies.map((hobby: IHobby, index: number) => (
                    <Hobby
                        key={hobby._id}
                        hobbyObj={hobby}
                        onUpdate={handleUpdateHobby}
                        onDelete={handleDeleteHobby}
                        isAdmin={isAdmin}
                        isLast={index === hobbies.length - 1}
                    />
                ))}
        
                <AddSkill 
                    handleAddSkill={handleAddHobby}
                    isAdmin={isAdmin}
                />
            </div>
        </div>
    );
};
