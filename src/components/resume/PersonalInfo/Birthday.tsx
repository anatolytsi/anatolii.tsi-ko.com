import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { IPersonalInfoCommonProps } from "./common"
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export const Birthday = ({ personalInfo, styles, setter, keyDown, isEditing }: IPersonalInfoCommonProps) => {
    const getYears = (birthdayMilis: any) => {
        let ageDifMs = Date.now() - birthdayMilis;
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    const [age, setAge] = useState(getYears(personalInfo?.birthday))
  
    useEffect(() => {
        setAge(getYears(personalInfo?.birthday));
    }, [personalInfo?.birthday]);

    return (
      <div className={styles.contactItem}>
        <FontAwesomeIcon icon={faBirthdayCake} />
        <DatePicker
          wrapperClassName={styles.birthday}
          selected={new Date(personalInfo?.birthday ?? 0 + /* margin to ensure correct date from start */ 1000000 ?? 0)}
          className={isEditing ? styles.editingBirthday : ''}
          readOnly={!isEditing}
          onChange={(birthday: Date) => setter({ ...personalInfo, birthday: birthday.getTime() })}
          dateFormat="dd.MM.yyyy"
        />
        <div className={styles.years}>
          ({age} years)
        </div>
      </div>
    );
}
