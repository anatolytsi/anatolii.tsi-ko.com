import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { IPersonalInfoCommonProps } from "./common"
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export const Birthday = ({ personalInfo, styles, setter, keyDown, isEditing }: IPersonalInfoCommonProps) => {
    if (typeof personalInfo?.birthday === 'number') {
        setter({ ...personalInfo, birthday: (new Date(personalInfo.birthday)).toString() })
    }
    const getYears = (birthdayDate: any) => {
        let ageDifMs = Date.now() - Date.parse(birthdayDate);
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    const birthdayUnnormal = new Date(personalInfo?.birthday ? personalInfo.birthday : '');
    const [age, setAge] = useState(getYears(personalInfo?.birthday))
  
    useEffect(() => {
        setAge(getYears(personalInfo?.birthday));
    }, [personalInfo?.birthday]);

    return (
      <div className={styles.contactItem}>
        <FontAwesomeIcon icon={faBirthdayCake} />
        <DatePicker
          wrapperClassName={styles.birthday}
          selected={personalInfo?.birthday ? new Date(birthdayUnnormal.getTime() - birthdayUnnormal.getTimezoneOffset() * -60000) : new Date()}
          className={isEditing ? styles.editingBirthday : ''}
          readOnly={!isEditing}
          onChange={(birthday: Date) => setter({ ...personalInfo, birthday: birthday.toString() })}
          dateFormat="dd.MM.yyyy"
        />
        <div className={styles.years}>
          ({age} years)
        </div>
      </div>
    );
}
