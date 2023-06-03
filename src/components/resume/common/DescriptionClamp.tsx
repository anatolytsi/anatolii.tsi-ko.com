import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import * as lodash from 'lodash';

interface DescriptionClampProps {
    children: any
    styles: any
    showClamp?: boolean
}

export const DescriptionClamp = ({ children,
                                   styles,
                                   showClamp=true}: DescriptionClampProps) => {
    const [clamped, setClamped] = useState(showClamp);
    const [showClampButton, setShowClampButton] = useState(showClamp);
    const clampContainerRef = useRef<HTMLDivElement>(null);
    const toggleClamp = () => setClamped(!clamped);
    
    React.useEffect(() => {
        const hasClamping = (el: any) => {
            const { clientHeight, scrollHeight } = el;
            return clientHeight !== scrollHeight;
        };
        const checkButtonAvailability = () => {
            if (clampContainerRef.current) {
                // Save current state to reapply later if necessary.
                const hadClampClass = clampContainerRef.current.classList.contains("clamp");
                // Make sure that CSS clamping is applied if aplicable.
                if (!hadClampClass) clampContainerRef.current.classList.add("clamp");
                // Check for clamping and show or hide button accordingly.
                setShowClampButton(hasClamping(clampContainerRef.current));
                // Sync clamping with local state.
                if (!hadClampClass) clampContainerRef.current.classList.remove("clamp");
            }
        };
    
        const debouncedCheck = lodash.debounce(checkButtonAvailability, 50);
    
        checkButtonAvailability();
        window.addEventListener("resize", debouncedCheck);
    
        return () => {
            window.removeEventListener("resize", debouncedCheck);
        };
    }, [clampContainerRef]);
    
    const renderClampButton = () => {
        if (showClampButton) {
            if (clamped) {
                return (
                    <button 
                        className={styles.clampButton}
                        onClick={toggleClamp}
                    >
                    Read more
                    <FontAwesomeIcon icon={faArrowDown} />
                    </button>
                );
            } else {
                return (
                    <button 
                    className={`${styles.clampButton} ${styles.expanded}`}
                    onClick={toggleClamp}
                    >
                    Read less
                    <FontAwesomeIcon icon={faArrowUp} />
                    </button>
                );
            }
        }
        return '';
    }

    return (
        <>
            <div
                ref={clampContainerRef}
                className={clamped ? styles.clamp : ''}
                >
                {children}
            </div>
            {renderClampButton()}
        </>
    );
};
