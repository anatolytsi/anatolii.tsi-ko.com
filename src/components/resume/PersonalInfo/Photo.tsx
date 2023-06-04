import { useEffect, useState } from "react";

import { uploadFile } from '../common/api-helpers';
import { IPersonalInfoCommonProps } from "./common"


const PhotoUpload = ({children, isEditing, uploadPhoto}: any) => {
    if (isEditing) {
      return (
        <>
          <input type="file" onChange={uploadPhoto} id="photoUpload" accept="image/*" style={{display: "none"}}/>
          <label htmlFor="photoUpload">
            {children}
          </label>
        </>
      )
    } else {
      return <>{children}</>;
    }
}

export const Photo = ({ personalInfo, styles, setter, keyDown, isEditing }: IPersonalInfoCommonProps) => {
    const [file, setFile] = useState(null);
    useEffect(() => {
      if (!file) {
        return;
      }
      const body = new FormData();
      body.append('media', file);
      uploadFile('file', body, (response) => {console.log(response.data.data.url); setter({...personalInfo, photoSrc: response.data.data.url})});
    }, [file]);

    const handlePhotoUpload = (event: any) => {
        if (event.target.files.length > 0) {
            const loadedFile = event.target.files[0];
            if (!loadedFile.type.startsWith("image")) {
                alert("Please select a valid image");
                return;
            }
            const filePreviewUrl = URL.createObjectURL(loadedFile);
            setter({...personalInfo, photoSrc: filePreviewUrl});
            setFile(loadedFile);
        }
    };
    return (
        <PhotoUpload isEditing={isEditing} uploadPhoto={handlePhotoUpload}>
            {personalInfo.photoSrc || isEditing ? 
                <img 
                    className={styles.avatar}
                    src={personalInfo.photoSrc}
                    alt="Avatar"
                />
            :<></>}
        </PhotoUpload>
    );
}
