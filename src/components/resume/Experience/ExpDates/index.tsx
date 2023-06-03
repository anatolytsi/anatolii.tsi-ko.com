import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ICommonExperienceProps, IExperience } from '../common';

const DATE_FORMAT = "MMM yyyy";
const DATES_FORMAT = "dd.MM.yyyy";

export const ExpDate = ({ isEditing,
                          styles,
                          setter,
                          exp }: ICommonExperienceProps) => {

    return (
        <div className={styles.date}>
            <DatePicker
                wrapperClassName={styles.datePicker}
                selected={new Date(exp!.date!)}
                className={isEditing ? styles.editingDate : ''}
                readOnly={!isEditing}
                onChange={(date: Date) => setter({...exp, date: date.getTime()})}
                dateFormat={DATE_FORMAT}
            />
        </div>
    );
}

export const ExpDates = ({ isEditing,
                           styles,
                           setter,
                           exp }: ICommonExperienceProps) => {

    const updateDate = (datekey: 'startDate' | 'endDate', date: Date) => {
        let dateMs: number = date.getTime();
        if ((datekey === 'endDate' && exp!.startDate! > dateMs) ||
            (datekey === 'startDate' && dateMs > exp!.endDate!)) {
    
            if (datekey === 'startDate') {
                setter({...exp, endDate: dateMs, startDate: dateMs});
            } else {
                setter({...exp, endDate: exp!.startDate});
            }
            return;
        }
        setter({ ...exp, [datekey]: dateMs })
    };

    const setTillCurrentDate = () => {
        setter({...exp, endDate: 0});
    }
    
    let endDateClass = exp?.endDate ? styles.datePicker : `${styles.datePicker} ${styles.current}`

    return (
        <div className={styles.dates}>
            <DatePicker
                wrapperClassName={styles.datePicker}
                selected={new Date(exp!.startDate!)}
                className={isEditing ? styles.editingStartDate : ''}
                readOnly={!isEditing}
                onChange={(date: Date) => updateDate('startDate', date)}
                dateFormat={DATES_FORMAT}
            />
            <span className={styles.datesDash}>-</span>
            <DatePicker
                wrapperClassName={endDateClass}
                selected={exp!.endDate ? new Date(exp!.endDate!) : null}
                className={isEditing ? styles.editingEndDate : ''}
                readOnly={!isEditing}
                onChange={(date: Date) => updateDate('endDate', date)}
                dateFormat={DATES_FORMAT}
                placeholderText="Current"
            />
            {isEditing ? (
                <button
                    className={styles.setCurrent}
                    onClick={setTillCurrentDate}
                >
                    Set current
                </button>
            ) : ('')}
        </div>
    );
}