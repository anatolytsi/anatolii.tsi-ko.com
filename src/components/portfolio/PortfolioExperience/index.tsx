
import { useEffect, useState } from "react";
import '@fortawesome/fontawesome-svg-core/styles.css';

import styles from './PortfolioExperience.module.scss';
import { Dates, Description, EditButton, Header, HeaderLine, ICommonExperienceProps, IExperience, Place, Title, Topic } from "@/components/resume/Experience";
import { compUpdate, uploadFile } from "@/components/resume/common/api-helpers";

export interface IPortfolioExperience {
    _id?: string
    experience: IExperience
    description: string
}

export interface IPortfolioExperienceData {
    _id?: string
    experience: string | number
    description: string
}

export interface IPortfolioExperienceProps {
    portfolioExperience: IPortfolioExperience
    key?: number
    editModeEnabled?: boolean
    forExport?: boolean
    isLast?: boolean
    isAdmin?: boolean
    gallery?: string[]
    addPictureToGallery: (pictureUrl: string) => void
}

const COMPONENT = 'portfolio';
const URL_PATH = 'expPortfolios';

export const PortfolioExperience = (props: IPortfolioExperienceProps) => {
    const {
        // expProps,
        portfolioExperience,
        editModeEnabled,
        forExport,
        key,
        isAdmin,
        isLast,
        gallery,
        addPictureToGallery
    } = props;
    
    const expProps: ICommonExperienceProps = {
        styles: styles,
        isEditing: false,
        setter: () => {},
        keyDown: () => {},
        forExport: forExport,
        isLast: false,
        editModeEnabled: editModeEnabled,
        saver: () => {},
        editor: () => {},
        deleter: () => {},
        shortVersion: false
    }
    const [portfolioExp, setPortfolioExp] = useState(portfolioExperience);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [compUpdated, setCompUpdated] = useState<boolean>(false);
    const [galleryOpen, setGalleryOpen] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState(null);


    useEffect(() => {
      if (!uploadedFile) {
        return;
      }
      const body = new FormData();
      body.append('media', uploadedFile);
      uploadFile(COMPONENT, 'file', body, (response) => {
        addPictureToGallery(response.data.data.url); 
        setUploadedFile(null)});
    }, [uploadedFile]);

    useEffect(() => {
        if (isEditing || compUpdated) {
            handleSave();
        }
    }, [expProps.editModeEnabled]);

    const handlePhotoUpload = (event: any) => {
        if (event.target.files.length > 0) {
            const loadedFile = event.target.files[0];
            if (!loadedFile.type.startsWith("image")) {
                alert("Please select a valid image");
                return;
            }
            const filePreviewUrl = URL.createObjectURL(loadedFile);
            setUploadedFile(loadedFile);
        }
    };

    const handleSet = (experience: IExperience) => {
      setPortfolioExp({...portfolioExp, description: experience.description ?? ''});
      setCompUpdated(true);
    }
  
    const handleSave = () => {
      setGalleryOpen(false);
      setIsEditing(false);
      let data: IPortfolioExperienceData = {
        experience: portfolioExp.experience._id ?? '', 
        description: portfolioExp.description
    };
      compUpdate(COMPONENT, URL_PATH, data, portfolioExp._id);
    };

    return (
        <div className={`${styles.portfolioExperience} ${forExport ? styles.exportPdf : ''}`} key={key}>
            <div className={styles.experienceHead}>
                <div className={styles.experienceData}>
                    <Header {...expProps} exp={portfolioExp.experience}>
                        <HeaderLine {...expProps} exp={portfolioExp.experience}>
                            <Title {...expProps} exp={portfolioExp.experience}/>
                            <Dates {...expProps} exp={portfolioExp.experience}/>
                        </HeaderLine>
                        <Place {...expProps} exp={portfolioExp.experience} shortVersion={true}/>
                        <Topic {...expProps} exp={portfolioExp.experience}/>
                    </Header>
                </div>
            </div>
            <div className={isLast ? `${styles.experienceContent} ${styles.last}` : styles.experienceContent}>
                {props.isAdmin && editModeEnabled ?
                    <div className={styles.controls}>
                        <div className={styles.panel}>
                            <EditButton {...expProps} editModeEnabled={editModeEnabled} experience={{...portfolioExp.experience, description: portfolioExp.description}} 
                                        isEditing={isEditing} handleSave={handleSave} handleEdit={() => setIsEditing(true)}/>
                            <a className={styles.photosButton} onClick={() => setGalleryOpen(!galleryOpen)}>
                                Gallery
                            </a>
                            <input type="file" onChange={handlePhotoUpload} id="photoUpload" accept="image/*" style={{display: "none"}}/>
                            <label className={styles.photosButton} htmlFor="photoUpload">
                                Add Photo
                            </label>
                        </div>
                        {galleryOpen && gallery
                        ?
                            <div className={styles.photoGallery}>
                                {gallery.map((picUrl: string, idx: number) => (
                                    <img src={picUrl} key={idx} className={styles.galleryPic} onClick={() => {navigator.clipboard.writeText(picUrl)}} draggable="false" unselectable="on"/>
                                ))}
                            </div>
                        : <></>}
                    </div>
                :<></>}
                <div className={styles.description}>
                    <Description  {...expProps} editModeEnabled={editModeEnabled} exp={{...portfolioExp.experience, description: portfolioExp.description}} isEditing={isEditing} setter={handleSet}/>
                </div>
            </div>
        </div>
    );
}
