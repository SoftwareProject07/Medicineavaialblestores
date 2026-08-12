import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';

export default function LivenessFaceCapture({ onSuccess }) {
    const videoRef = useRef(null);

    const [status, setStatus] = useState("AI Models Loading...");
    const [isVerified, setIsVerified] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const isProcessingRef = useRef(false);
    const animationFrameRef = useRef(null);

    // 👉 FIX: stable session id (not changing every call)
    const sessionIdRef = useRef(`SID_${crypto.randomUUID()}`);

    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

                setStatus("Downloading Face Tracking Data...");

                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

                setModelsLoaded(true);
                setStatus("Models Ready. Starting Camera...");
                startVideo();

            } catch (err) {
                console.error(err);
                setStatus("Model Loading Failed. Refresh Page.");
            }
        };

        loadModels();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: "user" }
        })
        .then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setStatus("Blink Naturally to Verify!");
            }
        })
        .catch((err) => {
            console.error(err);
            setStatus("Camera Permission Denied");
        });
    };

    const calculateEAR = (eye) => {
        const dist = (a, b) =>
            Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

        const v1 = dist(eye[1], eye[5]);
        const v2 = dist(eye[2], eye[4]);
        const h = dist(eye[0], eye[3]);

        return (v1 + v2) / (2.0 * h);
    };

    const captureAndVerify = useCallback(async () => {
        if (isProcessingRef.current) return;

        isProcessingRef.current = true;
        setIsVerified(true);
        setStatus("Blink Detected - Verifying...");

        try {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;

            const ctx = canvas.getContext("2d");

            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(videoRef.current, 0, 0);

            const base64Image = canvas.toDataURL("image/jpeg");

            // const payload = {
            //     sessionId: sessionIdRef.current,
            //     frameData: base64Image,
            //     blinkCount: 1,
            //     createdDate: new Date().toISOString()
            // };

            const payload = {
    sessionId: Date.now(),   // ✅ NUMBER (fix)
    frameData: base64Image,
    blinkCount: 1,
    imagePath: "",
    createdDate: new Date().toISOString()
};
           const response = await fetch(
    "http://localhost:5256/api/LIVENESSVerificationAPI/verify-blink",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }
);

const data = await response.text();

console.log(response.status);
console.log(data);
            const result = await response.json();

            if (response.ok && result.isLive) {
                setStatus("Verification Successful");
                setTimeout(() => onSuccess?.(), 1000);
            } else {
                setStatus("Verification Failed. Try Again");
                setIsVerified(false);
                isProcessingRef.current = false;
            }

        } catch (error) {
            console.error(error);
            setStatus("Server Error");
            setIsVerified(false);
            isProcessingRef.current = false;
        }
    }, [onSuccess]);

    useEffect(() => {
        if (!modelsLoaded || isVerified) return;

        const detect = async () => {
            if (
                videoRef.current &&
                videoRef.current.readyState === 4 &&
                !isProcessingRef.current
            ) {
                try {
                    const detection = await faceapi
                        .detectSingleFace(
                            videoRef.current,
                            new faceapi.TinyFaceDetectorOptions({
                                inputSize: 128,
                                scoreThreshold: 0.5
                            })
                        )
                        .withFaceLandmarks();

                    if (detection?.landmarks) {
                        const lm = detection.landmarks;

                        const leftEAR = calculateEAR(lm.getLeftEye());
                        const rightEAR = calculateEAR(lm.getRightEye());

                        const avgEAR = (leftEAR + rightEAR) / 2;

                        // FIX: proper threshold handling
                        if (avgEAR < 0.23) {
                            captureAndVerify();
                            return;
                        }
                    }

                } catch (e) {
                    console.error(e);
                }
            }

            if (!isProcessingRef.current) {
                animationFrameRef.current = requestAnimationFrame(detect);
            }
        };

        animationFrameRef.current = requestAnimationFrame(detect);

        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [modelsLoaded, isVerified, captureAndVerify]);

    return (
        <div className="text-center p-2">
            <div className="mb-3 fw-bold">
                {status}
            </div>

            <div style={{ maxWidth: 400, margin: "auto", position: "relative" }}>
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                        width: "100%",
                        transform: "scaleX(-1)"
                    }}
                />

                {!isVerified && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "60%",
                            height: "70%",
                            borderRadius: "50%",
                            border: "2px solid cyan",
                            opacity: 0.3
                        }}
                    />
                )}
            </div>
        </div>
    );
}