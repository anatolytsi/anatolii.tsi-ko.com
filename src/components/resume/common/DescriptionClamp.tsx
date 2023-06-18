import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import * as lodash from 'lodash';
import { event as gaEvent } from "nextjs-google-analytics";

interface DescriptionClampProps {
    children: any
    styles: any
    showClamp?: boolean
}

type TIterationTypes = NodeListOf<HTMLParagraphElement> | NodeListOf<HTMLOListElement> | NodeListOf<HTMLUListElement> 
| NodeListOf<HTMLLIElement> | NodeListOf<HTMLAnchorElement> | undefined;

export const DescriptionClamp = ({ children,
                                   styles,
                                   showClamp=true}: DescriptionClampProps) => {
    const [clamped, setClamped] = useState(showClamp);
    const [showClampButton, setShowClampButton] = useState(showClamp);
    const clampContainerRef = useRef<HTMLDivElement>(null);

    const setElementsInline = (elements: TIterationTypes) => {
        if (!elements) return;
        elements.forEach((el) => el.style.cssText = 'display: inline; padding-right: 0.3rem;');
    }

    const setElementsNormal = (elements: TIterationTypes) => {
        if (!elements) return;
        elements.forEach((el) => el.style.cssText = '');
    }

    const setAllElementsInline = () => {
        let parArr = clampContainerRef.current?.querySelectorAll('p');
        let olArr = clampContainerRef.current?.querySelectorAll('ol');
        let ulArr = clampContainerRef.current?.querySelectorAll('ul');
        let liArr = clampContainerRef.current?.querySelectorAll('li');
        let aArr = clampContainerRef.current?.querySelectorAll('a');
        setElementsInline(parArr);
        setElementsInline(olArr);
        setElementsInline(ulArr);
        setElementsInline(liArr);
        setElementsInline(aArr);
    }

    const setAllElementsNormal = () => {
        let parArr = clampContainerRef.current?.querySelectorAll('p');
        let olArr = clampContainerRef.current?.querySelectorAll('ol');
        let ulArr = clampContainerRef.current?.querySelectorAll('ul');
        let liArr = clampContainerRef.current?.querySelectorAll('li');
        let aArr = clampContainerRef.current?.querySelectorAll('a');
        setElementsNormal(parArr);
        setElementsNormal(olArr);
        setElementsNormal(ulArr);
        setElementsNormal(liArr);
        setElementsNormal(aArr);
    }

    const toggleClamp = () => {
        gaEvent('click', {category: 'resume', label: 'clampToggled'});
        if (clamped) {
            setAllElementsNormal();
        } else {
            setAllElementsInline();
        }
        setClamped(!clamped);
    };
    
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
                let clamping = hasClamping(clampContainerRef.current);
                setShowClampButton(clamping);
                setClamped(clamping);
                // Sync clamping with local state.
                if (!hadClampClass) clampContainerRef.current.classList.remove("clamp");
            }
        };
        
        if (showClamp) {
            const debouncedCheck = lodash.debounce(checkButtonAvailability, 50);
        
            checkButtonAvailability();
            window.addEventListener("resize", debouncedCheck);
            if (clamped) {
                setAllElementsNormal();
            } else {
                setAllElementsInline();
            }
    
            return () => {
                window.removeEventListener("resize", debouncedCheck);
            };
        }
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
