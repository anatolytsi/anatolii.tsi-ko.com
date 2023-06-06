import React from 'react';

export interface IExpListProps {
    styles: any
    children?: any
    sectionVisible: boolean
}

export const ExpList = ({ styles,
                          sectionVisible,
                          children }:IExpListProps) => {
    return (
        <div className={sectionVisible ? styles.experienceList : `${styles.experienceList} ${styles.sectionHidden}`}>
            {children}
        </div>
    );
}