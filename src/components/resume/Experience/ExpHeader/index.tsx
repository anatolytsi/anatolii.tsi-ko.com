import React from 'react';
import { ICommonExperienceProps } from '../common';

export const ExpHeader = ({ styles, children }: ICommonExperienceProps) => {
    return (
        <div className={styles.header}>
            {children}
        </div>
    );
}
