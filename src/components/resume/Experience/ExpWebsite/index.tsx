import React from 'react';
import { ICommonExperienceProps, IExpWebsite } from '../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

export const ExpWebsite = ({ styles,
                             setter,
                             keyDown,
                             exp,
                             website,
                             websiteIdx,
                             isEditing=false }: ICommonExperienceProps) => {
    
    const updateWebsite = (website: IExpWebsite, index: number) => {
        console.log(exp)
        let websites = [...exp!.websites!];
        websites[index] = {...website};
        setter({...exp, websites});
    }
    
    const deleteWebsite = (index: number) => {
        let websites = [...exp!.websites!];
        websites.splice(index, 1);
        setter({...exp, websites});
    }

    if (isEditing) {
        return (
            <div className={styles.websiteEdit}>
                <button 
                    type="button" 
                    onClick={() => deleteWebsite(websiteIdx!)}
                    className={styles.deleteButton}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
                <div>
                    <div className={styles.website}>
                        Website Name:
                        <span
                            suppressContentEditableWarning
                            contentEditable
                            onBlur={e => updateWebsite({...website!, name: e.target.innerText}, websiteIdx!)}
                        >
                            {website!.name}
                        </span>
                    </div>
                    <div className={styles.websiteLink}>
                        Website Link:
                        <span
                            suppressContentEditableWarning
                            contentEditable
                            onBlur={e => updateWebsite({...website!, link: e.target.innerText}, websiteIdx!)}
                        >
                            {website!.link}
                        </span>
                    </div>
                </div>
            </div>



            // <div className={styles.websitesEdit}>
            // {exp?.websites?.map((website: IExpWebsite, index: number) => (
            //     <div className={styles.websiteEdit} key={index}>
            //         <button 
            //             type="button" 
            //             onClick={() => deleteWebsite(index)}
            //             className={styles.deleteButton}
            //         >
            //             <FontAwesomeIcon icon={faTrash} />
            //         </button>
            //         <div>
            //             <div className={styles.websiteName}>
            //                 Website Name:
            //                 <span
            //                     suppressContentEditableWarning
            //                     contentEditable
            //                     onBlur={e => updateWebsite(website, index)}
            //                 >
            //                     {website.name}
            //                 </span>
            //             </div>
            //             <div className={styles.websiteLink}>
            //                 Website Link:
            //                 <span
            //                     suppressContentEditableWarning
            //                     contentEditable
            //                     onBlur={e => updateWebsite(website, index)}
            //                 >
            //                     {website.link}
            //                 </span>
            //             </div>
            //         </div>
            //     </div>
            // ))}
            //     <button
            //         type='button'
            //         onClick={addWebsite}
            //         className={styles.websiteAdd}
            //     >
            //         <FontAwesomeIcon icon={faPlusCircle} /> Add website
            //     </button>
            // </div>
        );
    } else {
        return (
            <div className={styles.website}>
                {website!.link ? (
                    <a href={website!.link}>
                        <h4>{website!.name}</h4>
                    </a>
                ) : (
                    <h4>{website!.name}</h4>
                )}
            </div>
        );
    }
}

export const ExpWebsites = (props: ICommonExperienceProps) => {
    const addWebsite = () => {
        let websites = [...props.exp!.websites!];
        websites.push({name: 'New website', link: 'newwebsitelink.com'});
        props.setter({...props.exp, websites});
    }

    return (
        <div className={props.styles.websites}>
            {props.exp?.websites?.map((website: IExpWebsite, index: number) => (
                <>
                    <ExpWebsite {...props} website={website} websiteIdx={index}/>
                    {!props.isEditing && (index != (props!.exp!.websites!.length - 1)) ?
                        <span className={props.styles.separator}>, </span>
                    :<></>}
                </>
            ))}
            {props.isEditing ?
                <button
                    type='button'
                    onClick={addWebsite}
                    className={props.styles.websiteAdd}
                >
                    <FontAwesomeIcon icon={faPlusCircle} /> Add website
                </button>
            :<></>}
        </div>
    );
}
