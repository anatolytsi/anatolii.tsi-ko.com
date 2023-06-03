import React from 'react';
import { ICommonExperienceProps } from '../common';

export const ExpHeaderLine = ({ styles, children }: ICommonExperienceProps) => {
    return (
        <div className={styles.headerLine}>
            {children}
        </div>
    );
}
