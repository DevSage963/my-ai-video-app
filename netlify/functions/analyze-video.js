const { Runway } = require('@runwayml/model-sdk');

exports.handler = async (event) => {
    const { videoUrl } = JSON.parse(event.body);

    const runway = new Runway({
        apiKey: process.env.RUNWAY_API_KEY
    });

    try {
        const analysis = await runway.models.video.highlights.analyze({
            videoUrl: videoUrl,
            parameters: {
                min_duration: 5,
                max_duration: 60
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(analysis.segments)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'فشل التحليل' })
        };
    }
};