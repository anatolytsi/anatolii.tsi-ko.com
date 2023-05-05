import dynamic from 'next/dynamic';
import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import Markdown from 'markdown-to-jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEdit, faSave, faTrash, faArrowUp, faArrowDown, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import * as lodash from 'lodash';

import 'react-datepicker/dist/react-datepicker.css';
import 'easymde/dist/easymde.min.css';
import { IResumeSectionComponent } from '../common';

const SimpleMDEEditor = dynamic(
    () => import('react-simplemde-editor'),
    {ssr: false}
);

export interface Experience {
    _id?: number
    title: string
    isVisible: boolean
    date?: number
    startDate?: number
    endDate?: number
    description?: string
}

export interface ExperienceListProps extends IResumeSectionComponent {
    isAdmin: boolean
}

interface ExperienceEditButtonProps {
    isAdmin: boolean
    isEditing: boolean
    styles: any
    experience: Experience
    setExperience: React.Dispatch<React.SetStateAction<any>>
    handleSave: any
    handleEdit: any
    onDelete: any
}

interface ExperienceDescriptionClampProps {
    children: any
    styles: any
    showClamp?: boolean
}

interface ExperienceClassProps {
    isLast: boolean
    isAdmin: boolean
    isVisible: boolean
    styles: any
    experienceStyle: any
}

interface GenericExperienceProps {
    experience: Experience
    setExperience: any
    onDelete: any
    handleSave: any
    isEditing: boolean
    setIsEditing: any
    isAdmin: boolean
    isLast: boolean
    styles: any
    mainStyleName: string
    datesNeeded?: boolean
    showClamp?: boolean
    addInfoRenderer?: any
    dateFormat?: string
}

export const ExperienceControlButtons = ({ isAdmin,
                                           isEditing,
                                           styles,
                                           experience,
                                           setExperience,
                                           handleSave,
                                           handleEdit,
                                           onDelete}: ExperienceEditButtonProps) => {
    if (isAdmin) {
        return (
          <>
              <div
                className={styles.controls}
              >
                {isEditing ? (
                    ''
                ) : (
                    <button
                        type='button'
                        onClick={() => setExperience({ ...experience, isVisible: !experience.isVisible })}
                        className={styles.visibilityButton}
                    >
                        {experience.isVisible ? 
                            (
                                <FontAwesomeIcon icon={faEye} />
                            ) : (
                                <FontAwesomeIcon icon={faEyeSlash} />
                            )
                        }
                    </button>
                )}
                    <button 
                        type="button" 
                        onClick={isEditing ? handleSave : handleEdit}
                        className={isEditing ? `${styles.editButton} ${styles.isEditing}` : styles.editButton}
                    >
                        {isEditing ? (
                            <FontAwesomeIcon icon={faSave} />
                        ) : (
                            <FontAwesomeIcon icon={faEdit} />
                        )}
                    </button>
                    {isEditing ? (
                        ''
                    ) : (
                        <>
                            <button 
                                type="button" 
                                onClick={() => onDelete(experience._id)}
                                className={styles.deleteButton}
                            >
                            <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </>
                    )}
              </div>
          </>
        );
    }
    return (<></>);
};

export const ExperienceDescriptionClamp = ({children,
                                            styles,
                                            showClamp=true}: ExperienceDescriptionClampProps) => {
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

export const getExperienceClass = ({isLast, 
                                    isAdmin, 
                                    styles, 
                                    isVisible, 
                                    experienceStyle}: ExperienceClassProps) => {
    let style = isLast ? `${experienceStyle} ${styles.last}` : experienceStyle;
    style = isVisible ? style : `${style} ${styles.hidden}`
    style = isAdmin ? `${style} ${styles.admin}` : style;
    return style;
};

export const handleExpKeyDown = (event: any, isEditing: boolean, experience: Experience, experienceSetter: any, handleSave: () => void) => {
    if (isEditing) {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if((event.ctrlKey || event.metaKey) && charCode === 's') {
            event.preventDefault();
            console.log(event.target)
            if (event.target.id && event.target.innerText && event.target.id in experience) {
                experienceSetter({...experience, [`${event.target.id}`]: event.target.innerText});
                // console.log(`${event.target.id}: ${event.target.innerText}`)
                handleSave();
            } else if (event.target.parentNode?.parentNode?.childNodes[5]?.className === 'CodeMirror-scroll' && 
                       event.target.parentNode?.parentNode?.childNodes[5]?.textContent && 
                       event.target.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.id &&
                       event.target.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.id in experience) {
                // Handle markdown area
                let compId = event.target.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.id;
                let text = event.target.parentNode?.parentNode?.childNodes[5]?.textContent;
                experienceSetter({...experience, [`${compId}`]: text});
                // console.log(`${compId}: ${text}`)
                handleSave();
            }
        }
    }
}

export const GenericExperience = ({ experience, 
                                    setExperience, 
                                    isEditing, 
                                    setIsEditing,
                                    handleSave,
                                    onDelete, 
                                    isAdmin, 
                                    isLast, 
                                    styles, 
                                    mainStyleName, 
                                    datesNeeded=true, 
                                    showClamp=true, 
                                    addInfoRenderer=() => {},
                                    dateFormat="dd.MM.yyyy" }: GenericExperienceProps) => {
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (event: any) => {
    handleExpKeyDown(event, isEditing, experience, setExperience, handleSave)
  };

  const updateDate = (datekey: 'startDate' | 'endDate', date: Date) => {
    let dateMs: number = date.getTime();
    if ((datekey === 'endDate' && experience.startDate! > dateMs) ||
        (datekey === 'startDate' && dateMs > experience.endDate!)) {

        if (datekey === 'startDate') {
            setExperience({...experience, endDate: dateMs, startDate: dateMs});
        } else {
            setExperience({...experience, endDate: experience.startDate});
        }
        return;
    }
    setExperience({ ...experience, [datekey]: dateMs })
  };

  const renderDates = () => {
    if (!datesNeeded) return <></>;
    if ('startDate' in experience) {
        return (
            <div className={styles.dates}>
                <DatePicker
                    wrapperClassName={styles.datePicker}
                    selected={new Date(experience.startDate!)}
                    className={isEditing ? styles.editingStartDate : ''}
                    readOnly={!isEditing}
                    onChange={(date: Date) => updateDate('startDate', date)}
                    dateFormat={dateFormat}
                />
                <span className={styles.datesDash}>-</span>
                <DatePicker
                    wrapperClassName={styles.datePicker}
                    selected={experience.endDate ? new Date(experience.endDate!) : null}
                    className={isEditing ? styles.editingEndDate : ''}
                    readOnly={!isEditing}
                    onChange={(date: Date) => updateDate('endDate', date)}
                    dateFormat={dateFormat}
                    placeholderText="Current"
                />
                {isEditing ? (
                    <button
                        className={styles.setCurrent}
                        onClick={setTillCurrentDate}
                    >
                        Set current
                    </button>
                ) : ('')}
            </div>
        );
    } else if (experience?.date) {
        return (
            <div className={styles.date}>
                <DatePicker
                    wrapperClassName={styles.datePicker}
                    selected={new Date(experience.date!)}
                    className={isEditing ? styles.editingDate : ''}
                    readOnly={!isEditing}
                    onChange={(date: Date) => setExperience({...experience, date: date.getTime()})}
                    dateFormat={dateFormat}
                />
            </div>
        );
    }
    return <></>;
  };

  const renderDescription = () => {
    if ('description' in experience) {
        return (
            <div
                id='description'
                className={styles.description}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onKeyDown={handleKeyDown}
            >
              {isEditing ? (
                <SimpleMDEEditor
                  value={experience.description}
                  onChange={value =>
                    setExperience({ ...experience, description: value })
                  }
                />
              ) : (
                <ExperienceDescriptionClamp styles={styles} showClamp={showClamp}>
                  <Markdown>{experience.description!}</Markdown>
                </ExperienceDescriptionClamp>
              )}
            </div>
        );
    }
    return <></>;
  }

  const setTillCurrentDate = () => {
    setExperience({...experience, endDate: 0});
  }

  return (
    <div className={styles.editExperience}>
      <ExperienceControlButtons
        isAdmin={isAdmin}
        isEditing={isEditing}
        styles={styles}
        experience={experience}
        setExperience={setExperience}
        handleSave={handleSave}
        handleEdit={handleEdit}
        onDelete={onDelete}
      />
      <div className={getExperienceClass({isLast, isAdmin, styles, isVisible: experience.isVisible, experienceStyle: styles[mainStyleName]})}>
        <div className={styles.header}>
          <div className={styles.titleDate}>
            <div className={styles.title}>
                <h3
                    id='title'
                    contentEditable={isEditing}
                    onBlur={e =>
                        setExperience({ ...experience, title: e.target.innerText })
                    }
                    suppressContentEditableWarning
                    onKeyDown={handleKeyDown}
                >
                    {experience.title}
                </h3>
            </div>
            {renderDates()}
          </div>
          {addInfoRenderer()}
        </div>
        {renderDescription()}
      </div>
    </div>
  );
}

interface IAddExperienceProps {
    isAdmin: boolean
    handleAddExperience: any
    styles: any
}

export const AddExperience = ({isAdmin, handleAddExperience, styles}: IAddExperienceProps) => {

    return (
        <>
            {isAdmin ?
                <button
                    type='button'
                    onClick={handleAddExperience}
                    className={styles.addExperience}
                >
                    <FontAwesomeIcon icon={faPlusCircle} size='lg' />
                </button>
            : ''}
        </>
    );
};

