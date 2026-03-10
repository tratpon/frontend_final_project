export async function uploadImage(image) {

    if (!image) return null;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "final_project");

    const res = await fetch(
        "https://api.cloudinary.com/v1_1/dncviozee/image/upload",
        {
            method: "POST",
            body: formData
        }
    );

    const data = await res.json();

    return data.secure_url;
}