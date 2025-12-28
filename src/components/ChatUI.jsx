// src/components/ChatUI.jsx
import { useState } from "react";
import "../three/style.css";

export default function ChatUI({ threeApi }) {
    const [message, setMessage] = useState("");
    const [bubble, setBubble] = useState(null);
    const [processing, setProcessing] = useState(false);

    const showBubble = (text) => {
        // Start talking animation
        threeApi.current?.playTalking();

        // Show empty bubble first
        setBubble({ text: "", loading: true });

        // Force the browser to render once before adding text
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setBubble({ text, loading: false });
            });
        });


        // Auto-remove bubble
        const duration = Math.min(10000, 2000 + text.length * 50);

        setTimeout(() => {
            setBubble(null);
            threeApi.current?.stopTalking();
        }, duration);
    };

    const handleSend = async () => {
        if (!message.trim() || processing) return;

        const lower = message.toLowerCase();
        setMessage("");
        setProcessing(true);

        // Dance trigger
        if (
            lower.includes("dance") ||
            lower.includes("song") ||
            lower.includes("sing")
        ) {
            threeApi.current?.dance();

            // Play song manually in AudioBank component
            const audio2 = document.getElementById("dance-audio-2");
            audio2.currentTime = 0;
            audio2.play();

            showBubble("Okay! Here's my dance! hehe");
            setTimeout(() => setProcessing(false), 1500);
            audio2.onended = () => {
                threeApi.current?.stopDance();
            };
            return;
        }

        // Otherwise call your backend
        try {
            const reply = await sendMessage(message);
            showBubble(reply);
            setTimeout(() => setProcessing(false), 1500);
        } catch (err) {
            console.error(err);
            showBubble(
                "Oops! I forgot to add more credits. Try again later :')"
            );
            setTimeout(() => setProcessing(false), 1500);
        }
    };

    const sendMessage = async (prompt) => {
        const response = await fetch("/.netlify/functions/azureServer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            messages: [
            {
                role: "system",
                content: `Your personality description...`
            },
            { role: "user", content: prompt }
            ],
            max_tokens: 150
        })
        });

        const data = await response.json();
        return (
            data?.choices?.[0]?.message?.content ??
            "AI unavailable right now."
        );
    };

    return (
        <div id="liveContainer">
            <div id="chat-area">
                {bubble && (
                <div className={`chat-bubble ${bubble.loading ? "loading" : ""}`}>
                    <span>{bubble.loading ? "" : bubble.text}</span>
                </div>
                )}
            </div>

            <div id="chat-container">
                <input
                    type="text"
                    id="chat-input"
                    placeholder="Ask me anything..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button id="send-btn" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}
