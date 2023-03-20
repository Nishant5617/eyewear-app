const MODEL_URL = '/scripts/models';

async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
}

async function setupWebcam() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.onloadedmetadata = () => video.play();
        });
}

loadModels().then(setupWebcam);

const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const ctx = overlay.getContext('2d');

async function detectFaces() {
    const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
    const detection = await faceapi.detectSingleFace(video, options).withFaceLandmarks();

    if (detection) {
        ctx.clearRect(0, 0, overlay.width, overlay.height);

        // Draw the detected face landmarks
        faceapi.draw.drawFaceLandmarks(overlay, detection);

        // Calculate and apply the transformation matrix for the 3D eyewear model
        // renderEyewearModel(ctx, detection);
    }

    requestAnimationFrame(detectFaces);
}

video.addEventListener('play', () => {
    detectFaces();
});
