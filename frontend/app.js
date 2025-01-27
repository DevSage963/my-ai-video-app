const API_ENDPOINT = '/.netlify/functions/analyze-video';

async function uploadVideo(file) {
    try {
        // رفع الفيديو إلى Cloudinary
        const cloudinaryData = new FormData();
        cloudinaryData.append('file', file);
        cloudinaryData.append('upload_preset', 'your_preset');

        const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/video/upload', {
            method: 'POST',
            body: cloudinaryData
        });

        const videoData = await uploadResponse.json();

        // تحليل الفيديو بالذكاء الاصطناعي
        const analysisResponse = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({ videoUrl: videoData.secure_url }),
            headers: { 'Content-Type': 'application/json' }
        });

        const highlights = await analysisResponse.json();

        // تقسيم الفيديو بناء على التحليل
        const shorts = await Promise.all(
            highlights.map(async (segment) => {
                const response = await fetch('/.netlify/functions/split-video', {
                    method: 'POST',
                    body: JSON.stringify({
                        videoId: videoData.public_id,
                        start: segment.start,
                        end: segment.end
                    })
                });
                return response.json();
            })
        );

        displayResults(shorts);
    } catch (error) {
        console.error('حدث خطأ:', error);
    }
}

function displayResults(shorts) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = shorts.map((short, index) => `
        <div class="video-card">
            <h3>المقطع ${index + 1}</h3>
            <video controls width="100%">
                <source src="${short.url}" type="video/mp4">
            </video>
            <a href="${short.url}" download>تنزيل المقطع</a>
        </div>
    `).join('');
}

// إدارة سحب وإسقاط الملفات
document.getElementById('videoInput').addEventListener('change', (e) => {
    uploadVideo(e.target.files[0]);
});

document.getElementById('dropZone').addEventListener('dragover', (e) => {
    e.preventDefault();
    e.target.style.background = '#333';
});

document.getElementById('dropZone').addEventListener('drop', (e) => {
    e.preventDefault();
    uploadVideo(e.dataTransfer.files[0]);
    e.target.style.background = '';
});