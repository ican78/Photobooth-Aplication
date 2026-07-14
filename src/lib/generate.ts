export async function generatePhoto(
    image: string,
    theme: string
) {

    //----------------------------------
    // Base64 -> Blob
    //----------------------------------

    const blob =
        await fetch(image)
            .then(r => r.blob());

    //----------------------------------
    // FormData
    //----------------------------------

    const form =
        new FormData();

    form.append(
        "image",
        blob,
        "capture.jpg"
    );

    form.append(
        "theme",
        theme
    );

    //----------------------------------
    // Call API
    //----------------------------------

    const response =
        await fetch(
            "/api/generate",
            {
                method: "POST",
                body: form
            }
        );

    const data =
        await response.json();

    if (!data.success) {

        throw new Error(
            data.error
        );

    }

    //----------------------------------
    // Return image url
    //----------------------------------

    return data.url;

}