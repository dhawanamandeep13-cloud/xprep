import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MockInterview from "./pages/MockInterview";
import ResumeBuilder from "./pages/ResumeBuilder";
import JobHunter from "./pages/JobHunter";
import QuestionsBank from "./pages/QuestionsBank";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/job-hunter" element={<JobHunter />} />
          <Route path="/questions-bank" element={<QuestionsBank />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
