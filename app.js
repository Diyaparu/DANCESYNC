// 1. ELEMENTS & NAVIGATION
const landingPage = document.getElementById('landing-page');
const appPage = document.getElementById('app-page');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const syncBtn = document.getElementById('sync-btn');

const proVideo = document.getElementById('pro-video');
const userVideo = document.getElementById('user-video');
const proCanvas = document.getElementById('pro-canvas');
const userCanvas = document.getElementById('user-canvas');
const scoreDisplay = document.getElementById('score-val');
const tipsContainer = document.getElementById('tips-container');
const tipsList = document.getElementById('tips-list');

const proCtx = proCanvas.getContext('2d');
const userCtx = userCanvas.getContext('2d');

let proLandmarks = null;
let userLandmarks = null;

// --- MOUSE FLOWING GLOW LOGIC ---
landingPage.addEventListener('mousemove', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
});

// --- NAVIGATION ---
startBtn.addEventListener('click', () => {
    landingPage.classList.add('hidden');
    appPage.classList.remove('hidden');
});

backBtn.addEventListener('click', () => {
    appPage.classList.add('hidden');
    landingPage.classList.remove('hidden');
    proVideo.pause();
    userVideo.pause();
    scoreDisplay.innerText = "0";
    tipsContainer.classList.add('hidden');
});

// --- MEDIAPIPE POSE SETUP ---
const poseOptions = { 
    modelComplexity: 1, 
    smoothLandmarks: true, 
    minDetectionConfidence: 0.5, 
    minTrackingConfidence: 0.5 
};

const proPose = new Pose({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`});
proPose.setOptions(poseOptions);
proPose.onResults(results => {
    proLandmarks = results.poseLandmarks;
    draw(proCtx, proCanvas, results);
});

const userPose = new Pose({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`});
userPose.setOptions(poseOptions);
userPose.onResults(results => {
    userLandmarks = results.poseLandmarks;
    draw(userCtx, userCanvas, results);
    if (proLandmarks && userLandmarks) calculateSync();
});

// --- FILE UPLOADS ---
[document.getElementById('pro-upload'), document.getElementById('user-upload')].forEach(input => {
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        
        // Hide tips when new files are uploaded
        tipsContainer.classList.add('hidden');

        if (e.target.id === 'pro-upload') { 
            proVideo.src = url; 
            proVideo.load(); 
        } else { 
            userVideo.src = url; 
            userVideo.load(); 
        }
        if (proVideo.src && userVideo.src) syncBtn.disabled = false;
    });
});

// --- ANALYSIS CONTROL ---
syncBtn.addEventListener('click', () => {
    tipsContainer.classList.add('hidden'); // Reset tips
    proVideo.currentTime = 0;
    userVideo.currentTime = 0;
    proVideo.play();
    userVideo.play();
    runLoop();
});

// TRIGGER TIPS ONLY WHEN VIDEO ENDS
proVideo.onended = () => {
    const finalScore = parseInt(scoreDisplay.innerText);
    showFinalReport(finalScore);
};

async function runLoop() {
    if (proVideo.paused || proVideo.ended || userVideo.paused) return;

    if (proCanvas.width !== proVideo.videoWidth) {
        proCanvas.width = proVideo.videoWidth;
        proCanvas.height = proVideo.videoHeight;
        userCanvas.width = userVideo.videoWidth;
        userCanvas.height = userVideo.videoHeight;
    }

    await proPose.send({image: proVideo});
    await userPose.send({image: userVideo});
    requestAnimationFrame(runLoop);
}

// --- DRAWING ---
function draw(ctx, canvas, results) {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    
    if (results.poseLandmarks) {
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#ffffffaa', lineWidth: 4});
        drawLandmarks(ctx, results.poseLandmarks, {color: '#00ffcc', radius: 3});
    }
    ctx.restore();
}

// --- MATH & SYNC ---
function getAngle(A, B, C) {
    if(!A || !B || !C) return 0;
    let AB = Math.sqrt(Math.pow(B.x-A.x,2) + Math.pow(B.y-A.y,2));
    let BC = Math.sqrt(Math.pow(B.x-C.x,2) + Math.pow(B.y-C.y,2));
    let AC = Math.sqrt(Math.pow(C.x-A.x,2) + Math.pow(C.y-A.y,2));
    return Math.acos((BC*BC + AB*AB - AC*AC) / (2*BC*AB)) * (180 / Math.PI);
}

function calculateSync() {
    const joints = [
        {a:11, b:13, c:15}, {a:12, b:14, c:16}, // Elbows
        {a:23, b:25, c:27}, {a:24, b:26, c:28}  // Knees
    ];
    let totalDiff = 0;
    joints.forEach(j => {
        let proA = getAngle(proLandmarks[j.a], proLandmarks[j.b], proLandmarks[j.c]);
        let userA = getAngle(userLandmarks[j.a], userLandmarks[j.b], userLandmarks[j.c]);
        totalDiff += Math.abs(proA - userA);
    });

    let avgDiff = totalDiff / joints.length;
    let score = (avgDiff < 1.8) ? 100 : Math.max(0, 100 - (avgDiff * 1.5));
    
    let finalScore = Math.floor(score);
    scoreDisplay.innerText = finalScore;
    scoreDisplay.style.color = finalScore > 85 ? '#00ffcc' : finalScore > 50 ? '#ffcc00' : '#ff4444';
}

// --- FINAL REPORT (TIPS) ---
function showFinalReport(score) {
    tipsContainer.classList.remove('hidden');
    
    let tips = [];
    if (score >= 90) {
        tips = ["🌟 Perfect Sync! Your core and limb timing matched exactly.", "Energy: Outstanding. You maintained high intensity throughout.", "Focus: Now work on adding more fluid head movements."];
    } else if (score >= 70) {
        tips = ["✅ Great Effort! You followed the main rhythm well.", "Adjustment: Try to make your arm movements sharper.", "Timing: Watch the transitions between moves more closely."];
    } else if (score >= 40) {
        tips = ["⚠️ Keep Working! Your legs are moving slightly late.", "Tip: Focus on the pro's hip movements to find the beat.", "Practice: Try at 0.75x speed to master the sequence."];
    } else {
        tips = ["❌ Focus on the basics. Your timing is off-beat.", "Correction: Avoid rushing into the next move too early.", "Next Step: Re-watch the reference and count the rhythm."];
    }

    tipsList.innerHTML = tips.map(tip => `<div class="tip-item">${tip}</div>`).join('');
    
    // Smooth scroll to the feedback section
    tipsContainer.scrollIntoView({ behavior: 'smooth' });
}