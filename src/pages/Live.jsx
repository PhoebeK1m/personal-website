import { useEffect, useRef } from "react";
import { initLive } from "../three/initLive";

export default function LivePage() {
    const mountRef = useRef(null);
    const videoRef = useRef(null);
    const guideRef = useRef(null);

    useEffect(() => {
        let cleanupFn = null;

        const frame = requestAnimationFrame(() => {
            if (!mountRef.current || !videoRef.current || !guideRef.current) return;

            cleanupFn = initLive({
                mount: mountRef.current,
                video: videoRef.current,
                guide: guideRef.current
            });
        });

        return () => {
            cancelAnimationFrame(frame);
            cleanupFn?.();
        };
    }, []);


    return (
        <div className="liveContainer">
            <div ref={mountRef} className="three-mount"></div>
            <div className="preview">
                <video ref={videoRef} className="input_video" autoPlay playsInline></video>
                <canvas ref={guideRef} className="guides"></canvas>
            </div>
            <div id="loading-screen">
                <div className="wave-text">
                    <span>L</span><span>o</span><span>a</span><span>d</span>
                    <span>i</span><span>n</span><span>g</span><span>.</span><span>.</span><span>.</span>
                </div>
            </div>
        </div>
    );
}
