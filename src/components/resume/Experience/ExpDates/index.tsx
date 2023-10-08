import React from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import { ICommonExperienceProps, IExperience } from '../common';
import { DatePicker } from '../../common/DatePicker';

const DATE_FORMAT = "MMM yyyy";
const DATES_FORMAT = "dd.MM.yyyy";
const DATE_TODAY = new Date();

export const ExpDate = ({ isEditing,
                          styles,
                          setter,
                          exp }: ICommonExperienceProps) => {

    return (
        <div className={styles.date}>
            <DatePicker
                wrapperClassName={styles.datePicker}
                selected={new Date(exp?.date ?? 0)}
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
                           exp,
                           forExport=false,
                           shortVersion=false }: ICommonExperienceProps) => {
    const getYearsAndMonths = (passedDate: Date) => {
        let years = Math.abs(passedDate.getUTCFullYear() - 1970);
        let months = passedDate.getUTCMonth();
        let days = passedDate.getUTCDate();
        if (days > 15) {
            months++;
            if (months >= 12) {
                years++;
                months = 0;
            }
        }
        return [years, months];
    }

    const isCurrentDate = (date: any) => {
        return !date || (!isEditing && date >= DATE_TODAY);
    }

    const getTimePeriod = (startDate: any, endDate: any) => {
        let passedDate = new Date(endDate - startDate);
        if (passedDate.getTime() <= 0) return 'n/a';
        let [years, months] = getYearsAndMonths(passedDate);
        let output = '';
        let yearsStr = shortVersion ? 'y' : ` year${years === 1 ? '' : 's'}`;
        let monthsStr = shortVersion ? 'm' : ` month${months === 1 ? '' : 's'}`;
        if (years) {
            output = `${years}${yearsStr}`;
            output += months ? `${shortVersion ? '' : ' and'} ${months}${monthsStr}` : '';
        } else {
            output = months ? `${months}${monthsStr}` : '';
        }

        if (!years && !months) {
            let days = passedDate.getUTCDate();
            let daysStr = shortVersion ? 'd' : ` day${days === 1 ? '' : 's'}`;
            output = days ? `${days}${daysStr}` : '';
        }

        return output;
    }

    const round = (value: number, precision: number) => {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    const getShortTimePeriod = (startDate: any, endDate: any) => {
        let passedDate = new Date(endDate - startDate);
        let [years, months] = getYearsAndMonths(passedDate);
        let output = '';
        years = round((years + (months / 12)), 1);
        if (years >= 1) {
            output = `${years}y`;
        } else {
            output = months ? `${months}m` : '';
        }

        if (!years && !months) {
            let days = passedDate.getUTCDate();
            output = days ? `${days}d` : '';
        }

        return output;
    }

    const updateDate = (datekey: 'startDate' | 'endDate', date: Date) => {
        let dateMs: number = date.getTime();
        if ((datekey === 'endDate' && exp?.startDate! > dateMs) ||
            (datekey === 'startDate' && dateMs > exp?.endDate!)) {
    
            if (datekey === 'startDate') {
                setter({...exp, endDate: dateMs, startDate: dateMs});
            } else {
                setter({...exp, endDate: exp?.startDate});
            }
            return;
        }
        setter({ ...exp, [datekey]: dateMs })
    };

    const setTillCurrentDate = () => {
        setter({...exp, endDate: 0});
    }
    
    let startDateClass = forExport ? `${styles.datePicker} ${styles.export}` : styles.datePicker;
    let endDateClass = forExport ? `${styles.datePicker} ${styles.export}` : styles.datePicker;
    endDateClass = isCurrentDate(exp?.endDate) ? `${endDateClass} ${styles.current}` : endDateClass;

    return (
        <div className={styles.datesWithTime}>
            <p className={styles.time}>
                {getTimePeriod(exp?.startDate, isCurrentDate(exp?.endDate) ? DATE_TODAY.getTime() : exp?.endDate)}
            </p>
            <div className={styles.dates}>
                <DatePicker
                    wrapperClassName={startDateClass}
                    selected={new Date(exp?.startDate ?? 0)}
                    className={isEditing ? styles.editingStartDate : ''}
                    readOnly={!isEditing}
                    onChange={(date: Date) => updateDate('startDate', date)}
                    dateFormat={DATES_FORMAT}
                />
                <span className={styles.datesDash}>—</span>
                <DatePicker
                    wrapperClassName={endDateClass}
                    selected={!exp?.endDate || isCurrentDate(exp?.endDate) ? null : new Date(exp.endDate)}
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
        </div>
    );
}