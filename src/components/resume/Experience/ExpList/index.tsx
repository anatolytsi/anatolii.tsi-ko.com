import React from 'react';

export interface IExpListProps {
    styles: any
    children?: any
    sectionVisible: boolean
    forExport?: boolean
}

export const ExpList = ({ styles,
                          sectionVisible,
                          children,
                          forExport=false }:IExpListProps) => {
    return (
        <div className={`${styles.experienceList} ${!sectionVisible && styles.sectionHidden} ${forExport && styles.exportPdf}`}>
            {children}
        </div>
    );
}