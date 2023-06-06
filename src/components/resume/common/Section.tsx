
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SectionControls, ICommonResumeSectionProps } from ".";

export interface ISectionProps extends ICommonResumeSectionProps {
    styles: any
    editModeEnabled: boolean
    faIcon: any
    sectionTitle: string
}

export const CommonSection = ({ styles,
                                sectionName,
                                order,
                                isVisible,
                                orderSetter,
                                visibilitySetter,
                                faIcon,
                                sectionTitle,
                                editModeEnabled=false}: ISectionProps) => {
    return (
        <SectionControls
            editModeEnabled={editModeEnabled}
            styles={styles}
            sectionName={sectionName}
            order={order}
            isVisible={isVisible}
            orderSetter={orderSetter}
            visibilitySetter={visibilitySetter}
        >
            <h2 className={styles.sectionTitle}>
                <FontAwesomeIcon icon={faIcon} />
                {sectionTitle}
            </h2>
        </SectionControls>
    );
}
