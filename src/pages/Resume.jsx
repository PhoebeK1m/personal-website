import "./Resume.css";
import { useEffect, useRef } from "react";



export default function Home() {
    const blobRef = useRef(null);
    useEffect(() => {
        const container = document.querySelector(".apple-container");
        const sections = document.querySelectorAll(".hero, .section");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                });
            },
            {  threshold: 0.4 }
        );

        sections.forEach((section) => observer.observe(section));



        const wrapper = blobRef.current;
        let currentX = window.innerWidth / 2;
        let currentY = window.innerHeight / 2;
        let targetX = currentX;
        let targetY = currentY;

        const handlePointerMove = (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
        };

        const animate = () => {
            const rect = wrapper.getBoundingClientRect();
            const halfW = rect.width / 2;
            const halfH = rect.height / 2;

            // LERP — this controls delay/smoothness
            const speed = 0.05;

            currentX += (targetX - currentX) * speed;
            currentY += (targetY - currentY) * speed;

            wrapper.style.transform =
            `translate(${currentX - halfW}px, ${currentY - halfH}px)`;

            requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handlePointerMove);
        animate(); // start the loop

        return () => {
            window.removeEventListener("mousemove", handlePointerMove);
            observer.disconnect();
        };
    }, []);

    return (
        <div className="apple-container">
            {/* Floating Blob */}
            <div id="blob-wrapper" ref={blobRef}>
                <div id="blob"></div>
            </div>
            <div id="blur"></div>
            
            {/* Hero */}
            <section className="hero">
                <h1 className="hero-title">Phoebe Kim
                </h1>
                <p className="subtitle">
                    CS @ UT Austin • Full Stack • AI
                </p>
            </section>

            <section className="section light">
                <div className="pfp-caption">
                    <p>
                        Hi! I'm Phoebe. I love creating <a href="https://github.com/PhoebeK1m">things</a> by combining my passion in art and programming.
                    </p>
                </div>
                <div className="pf-header">
                    <div className="pfp-wrapper"><img src="/phoebe.jpg" alt="" class="pfp"/></div>
                </div>
            </section>

            <section className="section image-section">
                    <a href="/chat" target="_blank" rel="noopener noreferrer">
                        <div className="video-wrapper">
                            <video 
                                src="/projectAMA.mp4" 
                                autoPlay 
                                loop 
                                muted 
                                playsInline
                            />

                            <button className="pill-btn">Talk to me</button>
                        </div>
                    </a>

                <div className="video-description">
                    <h2>Visit puppet me and ask me anything!</h2>
                    <p className="video-description-subtitle">
                        Built with Three.js and finetuned on gpt-4o with my chat messages.
                    </p>
                </div>
            </section>

            <section className="section dark">
                <h2>Selected Work</h2>
                <div className="grid">
                    <a
                    href="/live"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                    >
                        <div className="card">
                            <div className="img-wrapper">
                                <img src="/vrm.png" alt="" />
                            </div>
                            <h3>3D Avatar Live Tracking</h3>
                            <p>Real-time VRM tracking powered by Mediapipe + Three.js</p>
                        </div>
                    </a>

                    <a
                    href="https://nuclear-twins.tacc.utexas.edu/txt2sql"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                    >
                        <div className="card">
                            <div className="img-wrapper">
                                <img src="/txt2sql.png" alt=""/>
                            </div>
                            <h3>Txt2SQL for NETL Database</h3>
                            <p>Natural language access to TRIGA database using Langchain</p>
                        </div>
                    </a>

                    <a
                    href="https://github.com/PhoebeK1m/Rod-Pump-Survival-Prediction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                    >
                        <div className="card">
                            <div className="img-wrapper">
                                <img src="/coxph.png" alt=""/>
                            </div>
                            <h3>Survival Model Analysis</h3>
                            <p>Predicted lifetime and hazardous parameters of rod pump data with ConocoPhillips</p>
                        </div>
                    </a>
                </div>
            </section>
        </div>
    );
}
