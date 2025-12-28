// src/components/PasswordGate.jsx
import { useState } from "react";
import "../three/style.css";

export default function PasswordGate() {
    const [visible, setVisible] = useState(true);
    const [error, setError] = useState("");

    const PASSWORD = "beansbeans";

    const checkPassword = (e) => {
        if (e.key === "Enter") {
        if (e.target.value.trim().toLowerCase() === PASSWORD.toLowerCase()) {
            setVisible(false);
        } else {
            setError("Incorrect password. Try again.");
            e.target.value = "";
        }
        }
    };

    if (!visible) return null;

    return (
        <div id="liveContainer">
            <div id="password-screen">
                <div id="password-box">
                    <h2>Enter Password</h2>
                    <input
                    type="password"
                    id="password-input"
                    onKeyDown={checkPassword}
                    />
                    <p id="password-error">{error}</p>
                </div>
            </div>
        </div>
    );
}
