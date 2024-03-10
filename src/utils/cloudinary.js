import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"         
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY, 
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
     try {
       if(!localFilePath) return null
       const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type:"auto"
       }) 
       //file has been uploaded
       console.log("File successfully uploaded",response.url);
       return response;
     } 
     //error in uploading 
     catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally temporray saved file as upload is failed
        return null;
     }
}
export {uploadOnCloudinary}