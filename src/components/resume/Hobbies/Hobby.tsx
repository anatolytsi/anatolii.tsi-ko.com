import { useEffect, useRef, useState } from "react";

import styles from './Hobbies.module.scss';
import { GenericSkill, ISkill } from "../Skills";
import { compUpdate } from "../common/api-helpers";
import { WAIT_EFFECT } from "../common";

export interface IHobby extends ISkill {}

export interface IHobbyProps {
    hobbyObj: IHobby
    onUpdate: any
    onDelete: any
    isAdmin: boolean
    isLast: boolean
} 

export const Hobby = ({ hobbyObj, onUpdate, onDelete, isAdmin, isLast }: IHobbyProps) => {
    const [hobby, setHobby] = useState(hobbyObj);
    const [isEditing, setIsEditing] = useState(false);
    const firstUpdate = useRef(WAIT_EFFECT);
  
    useEffect(() => {
      if (firstUpdate.current) {
        firstUpdate.current--;
        return;
      }
      compUpdate('hobbies', hobby, hobby._id, (response) => onUpdate(response.data));
    }, [hobby]);

    return (
        <GenericSkill
            skill={hobby}
            setSkill={setHobby}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isAdmin={isAdmin}
            isLast={isLast}
            styles={styles}
            mainClsName={'hobby'}
        />
    );
};
