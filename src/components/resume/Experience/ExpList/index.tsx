import React from 'react';

export interface IExpListProps {
    styles: any
    children?: any
    sectionVisible: boolean
    forExport?: boolean
    singlePage?: boolean
}

export const ExpList = ({ styles,
                          sectionVisible,
                          children,
                          forExport=false,
                          singlePage=false }:IExpListProps) => {
    return (
        <div className={`${styles.experienceList} ${!sectionVisible ? styles.sectionHidden : ''} ${forExport ? styles.exportPdf : ''} ${singlePage ? styles.singlePage : ''}`}>
            {children}
        </div>
    );
}