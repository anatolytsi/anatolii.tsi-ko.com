import { ICommonExperienceProps } from '../common';

const STYLE_NAME = 'experience';


interface ExperienceClassProps {
    isLast: boolean
    editModeEnabled: boolean
    isVisible: boolean
    styles: any
    experienceStyle: any
    shortVersion?: boolean
}

const getExperienceClass = ({ isLast, 
                              editModeEnabled, 
                              styles, 
                              isVisible, 
                              experienceStyle,
                              shortVersion=false }: ExperienceClassProps) => {
    let style = isLast ? `${experienceStyle} ${styles.last}` : experienceStyle;
    style = isVisible ? style : `${style} ${styles.hidden}`
    style = editModeEnabled ? `${style} ${styles.admin}` : style;
    style = shortVersion ? `${style} ${styles.shortVersion}` : style;
    return style;
};

export const ExpContent = ({ styles,
                             exp,
                             children,
                             isLast=false,
                             editModeEnabled=false,
                             shortVersion=false }: ICommonExperienceProps) => {
    return (
        <div className={getExperienceClass({isLast, editModeEnabled, styles, isVisible: !!exp?.isVisible, experienceStyle: styles[STYLE_NAME], shortVersion})}>
            {children}
        </div>
    );
}