exports.handler = async (event) => {
    const { videoUrl } = JSON.parse(event.body);

    try {
        const response = await fetch('https://api.runwayml.com/v1/video/analyze', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: { url: videoUrl },
                model: "highlight-detection"
            })
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data.result.segments)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'فشل التحليل' })
        };
    }
};