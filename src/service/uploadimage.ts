import cloudinary from "@/lib/cloudinary";

export async function uploadImage(
    imagePath: string
) {

    const result =
        await cloudinary.uploader.upload(
            imagePath,
            {
                folder: "photobooth",
                resource_type: "image"
            }
        );

    return result;

}