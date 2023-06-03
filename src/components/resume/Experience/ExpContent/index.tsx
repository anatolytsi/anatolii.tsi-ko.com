import { ICommonExperienceProps } from '../common';

const STYLE_NAME = 'experience';


interface ExperienceClassProps {
    isLast: boolean
    isAdmin: boolean
    isVisible: boolean
    styles: any
    experienceStyle: any
}

const getExperienceClass = ({ isLast, 
                              isAdmin, 
                              styles, 
                              isVisible, 
                              experienceStyle }: ExperienceClassProps) => {
    let style = isLast ? `${experienceStyle} ${styles.last}` : experienceStyle;
    style = isVisible ? style : `${style} ${styles.hidden}`
    style = isAdmin ? `${style} ${styles.admin}` : style;
    return style;
};

export const ExpContent = ({ styles,
                             exp,
                             children,
                             isLast=false,
                             isAdmin=false }: ICommonExperienceProps) => {
    return (
        <div className={getExperienceClass({isLast, isAdmin, styles, isVisible: exp!.isVisible, experienceStyle: styles[STYLE_NAME]})}>
            {children}
        </div>
    );
}