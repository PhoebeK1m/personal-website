import { Link } from "react-router-dom";
import "../three/style.css";

export default function Navbar() {
    return (
            <nav>
                <Link to="/chat">
                    <img src="ask.png" alt="Home" className="nav-icon" />
                </Link>

                <Link to="/live">
                    <img src="camera.png" alt="Live" className="nav-icon" />
                </Link>

                <a href="/">
                    <img src="resume.png" alt="Resume" className="nav-icon" />
                </a>
            </nav>
    );
}
