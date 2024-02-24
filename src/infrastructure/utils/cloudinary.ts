import { v2 as cloudinary } from "cloudinary";
import CloudinaryInterface from "../../usecase/interface/cloudinaryInterface";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class Cloudinary implements CloudinaryInterface {
  async savetoCloudinary(file: any): Promise<string | null> {
    console.log(`Inside Cloudinary`);

    try {
      const maxBytes = 10485760;

        if (file.size > maxBytes) {
          throw new Error("File sie too large, Maximum is 10MB")
        }
        const result = await cloudinary.uploader.upload(file?.path, {
            resource_type: 'auto',
            quality_auto:'best',
        })
      return result.secure_url

      
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
      throw error;
    }
  }
}

export default Cloudinary; 
