import { getMonth, getYear } from 'date-fns';
import { range } from 'lodash';
import ReactDatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerHeader = ({ date,
                            changeYear,
                            changeMonth,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled }: ReactDatePickerCustomHeaderProps) => {
    const years = range(1990, getYear(new Date()) + 1, 1);
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return (
        <div
            style={{
                margin: 10,
                display: "flex",
                justifyContent: "center",
            }}
        >
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                {"<"}
            </button>
            <select
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(parseInt(value))}
            >
            {years.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
            </select>

            <select
                value={months[getMonth(date)]}
                onChange={({ target: { value } }) =>
                    changeMonth(months.indexOf(value))
                }
            >
            {months.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
            </select>

            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                {">"}
            </button>
        </div>
    );
}

export const DatePicker = (props: ReactDatePickerProps) => {
    return (
        <ReactDatePicker
            {...props}
            renderCustomHeader={DatePickerHeader}
        />
    );
}