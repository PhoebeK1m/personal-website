import { useEffect, useRef } from "react";
import { initThree } from "../three/initChat";

export default function ThreeScene({ apiRef }) {
    const mountRef = useRef(null);

    useEffect(() => {
        let cleanupFn = null;

        const frame = requestAnimationFrame(() => {
            if (!mountRef.current) return;

            const api = initThree(mountRef.current);
            if (apiRef) apiRef.current = api;

            cleanupFn = api.cleanup;
        });

        return () => {
            cancelAnimationFrame(frame);
            cleanupFn?.();
        };
    }, []);

    return (
        <div id="liveContainer">
            <div
                ref={mountRef}
                style={{
                    width: "100vw",
                    height: "100vh",
                    overflow: "hidden"
                }}
            />
        </div>
    );
}
