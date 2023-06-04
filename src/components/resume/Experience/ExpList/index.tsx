import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SectionControls } from '../../common';

export interface IExpListProps {
    styles: any
    editModeEnabled: boolean
    visibilityState: any
    orderingState: any
    faIcon: any
    sectionTitle: string
    children?: any
}

export const ExpList = ({ styles,
                          visibilityState,
                          orderingState,
                          faIcon,
                          sectionTitle,
                          children,
                          editModeEnabled=false}:IExpListProps) => {
    return (
        <div className={visibilityState[0] ? styles.experienceList : `${styles.experienceList} ${styles.sectionHidden}`}>
            <SectionControls
                editModeEnabled={editModeEnabled}
                styles={styles}
                visibilityState={visibilityState}
                orderingState={orderingState}
            >
                <h2 className={styles.sectionTitle}>
                    <FontAwesomeIcon icon={faIcon} />
                    {sectionTitle}
                </h2>
            </SectionControls>

            {children}
            
        </div>
    );
}