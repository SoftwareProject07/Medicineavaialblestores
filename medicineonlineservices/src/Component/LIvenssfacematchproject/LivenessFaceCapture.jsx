import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';

export default function LivenessFaceCapture({ onSuccess }) {
    const videoRef = useRef(null);
    const [status, setStatus] = useState("AI Models Loading...");
    const [isVerified, setIsVerified] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    
    // Refs का उपयोग ताकि लूप बिना किसी रुकावट के तेज़ी से चले
    const isProcessingRef = useRef(false);
    const animationFrameRef = useRef(null);

    // 1. CDN से मॉडल्स लोड करना (No Public Folder Issue)
    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models'; 
                setStatus("Downloading Face Tracking Data...");
                
                // दोनों मॉडल्स लोड होना अनिवार्य है
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
                
                console.log("AI Models Loaded Successfully.");
                setModelsLoaded(true);
                setStatus("Models Ready. Starting Camera...");
                startVideo();
            } catch (err) {
                setStatus("Model Connection Error. Please Refresh.");
                console.error("Model Loading Failed:", err);
            }
        };
        loadModels();

        // Cleanup: पेज बदलने पर कैमरा और लूप बंद करना
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // 2. वेबकैम चालू करना
    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480, facingMode: "user" } 
        })
        .then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setStatus("Align Face & Blink Naturally to Capture!");
            }
        })
        .catch((err) => {
            setStatus("Camera Access Denied.");
            console.error(err);
        });
    };

    // 3. EAR (Eye Aspect Ratio) कैलकुलेशन सूत्र
    const calculateEAR = (eye) => {
        const dist = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        const v1 = dist(eye[1], eye[5]);
        const v2 = dist(eye[2], eye[4]);
        const h = dist(eye[0], eye[3]);
        return (v1 + v2) / (2.0 * h);
    };

    // 4. ऑटोमैटिक बैकग्राउंड इमेज कैप्चर और API सबमिशन
    const captureAndVerify = useCallback(async () => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true; // लूप को तुरंत लॉक करें ताकि दोबारा ट्रिगर न हो
        
        setIsVerified(true);
        setStatus("Blink Detected! Capturing Face...");

        try {
            // वीडियो फ्रेम से ऑटोमैटिक इमेज क्रॉप/कैप्चर करना
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            
            // यूजर एक्सपीरियंस के लिए मिरर इफेक्ट को ठीक करना
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            
            const base64Image = canvas.toDataURL('image/jpeg');

            const payload = {
                sessionId: Date.now(),
                frameData: base64Image,
                blinkCount: 1
            };

            // API पर डेटा भेजना
            const response = await fetch(
                
                "http://localhost:5256/api/LIVENESSVerificationAPI/verify-blink",
                
                {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (result.isLive || response.ok) {
                setStatus("Identity Verified Successfully!");
                // वेरिफिकेशन सफल होने पर App.js के Redirect Function को कॉल करना
                setTimeout(() => onSuccess(), 1200); 
            } else {
                setStatus("Liveness Check Failed. Try Again.");
                setIsVerified(false);
                isProcessingRef.current = false;
            }
        } catch (error) {
            setStatus("Server Error. Retrying...");
            setIsVerified(false);
            isProcessingRef.current = false;
        }
    }, [onSuccess]);

    // 5. सुपर-फ़ास्ट रियल-टाइम डिटेक्शन लूप (60 Frames Per Second)
    useEffect(() => {
        if (!modelsLoaded || isVerified) return;

        const detectFrame = async () => {
            if (videoRef.current && videoRef.current.readyState === 4 && !isProcessingRef.current) {
                try {
                    // inputSize को छोटा (128) किया ताकि कमज़ोर कैमरे पर भी तुरंत रिस्पॉन्स मिले
                    const detection = await faceapi.detectSingleFace(
                        videoRef.current, 
                        new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.5 })
                    ).withFaceLandmarks();

                    if (detection && detection.landmarks) {
                        const landmarks = detection.landmarks;
                        const leftEAR = calculateEAR(landmarks.getLeftEye());
                        const rightEAR = calculateEAR(landmarks.getRightEye());
                        const avgEAR = (leftEAR + rightEAR) / 2;

                        // यदि EAR वैल्यू 0.24 से कम है, तो पलक झपक चुकी है
                        if (avgEAR < 0.24) {
                            captureAndVerify(); // तुरंत ऑटोमैटिक कैप्चर फंक्शन चलाएं
                            return; // लूप से बाहर निकलें
                        }
                    }
                } catch (err) {
                    console.error("Frame processing error:", err);
                }
            }
            
            // अगर वेरिफिकेशन नहीं हुआ है, तो अगला फ्रेम चेक करते रहें
            if (!isProcessingRef.current) {
                animationFrameRef.current = requestAnimationFrame(detectFrame);
            }
        };

        // लूप शुरू करें
        animationFrameRef.current = requestAnimationFrame(detectFrame);

        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [modelsLoaded, isVerified, captureAndVerify]);

    return (
        <div className="p-2 text-center">
            {/* डायनामिक स्टेटस बार */}
            <div className={`btn ${isVerified ? 'btn-success animate-pulse' : 'btn-primary'} mb-3 fw-bold disabled w-100 fs-6`}>
                {isVerified ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span>{status}</span>
                ) : (
                    <span><i className="bi bi-camera-video-fill me-2"></i>{status}</span>
                )}
            </div>
            
            {/* कैमरा फ्रेम बॉक्स */}
            <div className="overflow-hidden rounded-4 border border-3 border-primary shadow mx-auto position-relative" style={{ maxWidth: '400px', backgroundColor: '#000' }}>
                <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline
                    style={{ 
                        width: '100%', 
                        display: 'block',
                        transform: 'scaleX(-1)' // शीशे जैसा व्यू (Mirror View)
                    }} 
                />
                
                {/* फेस गाइड ओवरले (यूजर को चेहरा सही जगह रखने में मदद के लिए) */}
                {!isVerified && (
                    <div className="position-absolute top-50 start-50 translate-middle border border-2 border-info rounded-circle opacity-25" 
                         style={{ width: '60%', height: '70%', pointerEvents: 'none' }}></div>
                )}
            </div>
        </div>
    );
}