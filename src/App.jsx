// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useRef } from "react";

import Chat from "./pages/Chat";
import Live from "./pages/Live";
import Resume from "./pages/Resume";

import ChatUI from "./components/ChatUI";
import PasswordGate from "./components/PasswordGate";
import Navbar from "./components/Navbar";
import Audio from "./components/Audio";

export default function App() {
  const threeApi = useRef(null);

  return (
    <>
      <Routes>
        {/* CHAT PAGE */}
        <Route
          path="/chat"
          element={
            <>
              <Navbar />
              <PasswordGate />
              <Audio />
              <Chat apiRef={threeApi} />
              <ChatUI threeApi={threeApi} />
            </>
          }
        />

        {/* LIVE PAGE */}
        <Route path="/live"
          element={
            <>
              <Navbar />
              <Live />
            </>
          } 
        />

        {/* RESUME PAGE */}
        <Route path="/"
          element={
            <Resume />
          } 
        />
      </Routes>
    </>
  );
}
