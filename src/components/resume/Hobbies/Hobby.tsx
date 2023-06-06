import { useState } from "react";

import styles from './Hobbies.module.scss';
import { GenericSkill, ISkill } from "../Skills";

export interface IHobby extends ISkill {}

export interface IHobbyProps {
    hobbyObj: IHobby
    onUpdate: any
    onDelete: any
    editModeEnabled: boolean
    isLast: boolean
} 

export const Hobby = ({ hobbyObj, onUpdate, onDelete, editModeEnabled, isLast }: IHobbyProps) => {
    const [hobby, setHobby] = useState(hobbyObj);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <GenericSkill
            skill={hobby}
            setSkill={setHobby}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onUpdate={onUpdate}
            onDelete={onDelete}
            editModeEnabled={editModeEnabled}
            isLast={isLast}
            styles={styles}
            mainClsName={'hobby'}
        />
    );
};
