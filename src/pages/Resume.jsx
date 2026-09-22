import "./Resume.css";
import { useEffect, useRef, useState } from "react";



export default function Home() {
    const blobRef = useRef(null);
    const [workIndex, setWorkIndex] = useState(0);
    const projectCount = 3;

    const changeProject = (direction) => {
        setWorkIndex((currentIndex) =>
            (currentIndex + direction + projectCount) % projectCount
        );
    };

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
                <h1 className="hero-title">
                    <a href="#resume">Phoebe Kim</a>
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

            <section className="section dark work-section">
                <div className="work-header">
                    <div>
                        <p className="work-kicker">Selected Work</p>
                        <h2>Things I&rsquo;ve built.</h2>
                    </div>
                    <div className="work-count" aria-live="polite">
                        <span>{String(workIndex + 1).padStart(2, "0")}</span>
                        <span>/</span>
                        <span>{String(projectCount).padStart(2, "0")}</span>
                    </div>
                </div>

                <div className="work-carousel">
                    <button
                        type="button"
                        className="carousel-arrow carousel-arrow-previous"
                        onClick={() => changeProject(-1)}
                        aria-label="Show previous project"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M14.5 5 7.5 12l7 7" />
                        </svg>
                    </button>

                    <div className="work-viewport">
                    <div
                        className="work-track"
                        style={{ transform: `translateX(-${workIndex * 100}%)` }}
                    >
                    <a
                    href="https://github.com/PhoebeK1m/caustics-final-project"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link project-card"
                    aria-hidden={workIndex !== 0}
                    tabIndex={workIndex === 0 ? 0 : -1}
                    >
                        <div className="card">
                            <div className="project-visual">
                                <img src="/pickle_pond.png" alt="Placeholder for the water caustics project" />
                            </div>
                            <div className="project-copy">
                                <span>01 / Computer Graphics</span>
                                <h3>Real-time Water Caustics</h3>
                                <p>GPU-driven water simulation and caustic light rendering built with custom shaders and Three.js</p>
                            </div>
                        </div>
                    </a>

                    <a
                    href="/live"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link project-card"
                    aria-hidden={workIndex !== 1}
                    tabIndex={workIndex === 1 ? 0 : -1}
                    >
                        <div className="card">
                            <div className="project-visual">
                                <img src="/vrm.png" alt="3D avatar being controlled with body tracking" />
                            </div>
                            <div className="project-copy">
                                <span>02 / Interactive</span>
                                <h3>3D Puppet Live Tracking</h3>
                                <p>Real-time VRM tracking powered by Mediapipe + Three.js</p>
                            </div>
                        </div>
                    </a>

                    <a
                    href="https://github.com/PhoebeK1m/Rod-Pump-Survival-Prediction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link project-card"
                    aria-hidden={workIndex !== 2}
                    tabIndex={workIndex === 2 ? 0 : -1}
                    >
                        <div className="card">
                            <div className="project-visual">
                                <img src="/coxph.png" alt="Survival model analysis charts"/>
                            </div>
                            <div className="project-copy">
                                <span>03 / Energy + Data</span>
                                <h3>Survival Model Analysis</h3>
                                <p>Predicted lifetime and hazardous parameters of rod pump data with ConocoPhillips</p>
                            </div>
                        </div>
                    </a>
                    </div>
                    </div>

                    <button
                        type="button"
                        className="carousel-arrow carousel-arrow-next"
                        onClick={() => changeProject(1)}
                        aria-label="Show next project"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m9.5 5 7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </section>

            <section className="section resume-section" id="resume">
                <div className="resume-card">
                    <div className="resume-heading">
                        <p className="resume-kicker">Résumé</p>
                        <h2>A little more about me.</h2>
                    </div>

                    <div className="resume-preview-heading">
                        <span></span>
                        <a href="/Resume_2027.pdf" target="_blank" rel="noopener noreferrer">
                            Open in a new tab
                        </a>
                    </div>
                    <object className="resume-preview" data="/Resume_2027.pdf" type="application/pdf"></object>
                </div>
            </section>
        </div>
    );
}
