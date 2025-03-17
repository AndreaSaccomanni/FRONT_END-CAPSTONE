// src/App.jsx
import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/Layout/NavbarComponent";
import FooterComponent from "./components/Layout/FooterComponent";
import Home from "./components/Home";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import PrenotazioniComponent from "./components/PrenotazioniComponent";
import ChiSono from "./components/ChiSono";
import ServiceSection from "./components/ServiceSection";
import CreaPrenotazioneComponent from "./components/CreaPrenotazioneComponent";
import UtentiComponent from "./components/UtentiComponent";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavbarComponent />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chiSono" element={<ChiSono />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/registrazione" element={<RegisterComponent />} />
            <Route path="/prenotazioni" element={<PrenotazioniComponent />} />
            <Route path="/servizi" element={<ServiceSection />} />
            <Route path="/creaprenotazione" element={<CreaPrenotazioneComponent />} />
            <Route path="/utenti" element={<UtentiComponent />} />
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;
