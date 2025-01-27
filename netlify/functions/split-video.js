const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.handler = async (event) => {
    const { videoId, start, end } = JSON.parse(event.body);

    try {
        const result = await cloudinary.video(videoId, {
            transformation: [
                { flags: "splice", start_offset: start, duration: end - start }
            ]
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ url: result.secure_url })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'فشل التقسيم' })
        };
    }
};