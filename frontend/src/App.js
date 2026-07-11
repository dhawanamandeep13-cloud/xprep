import React from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SEO, { getRouteMeta } from "./components/SEO";
import Home from "./pages/Home";
import MockInterview from "./pages/MockInterview";
import ResumeBuilder from "./pages/ResumeBuilder";
import JobHunter from "./pages/JobHunter";
import QuestionsBank from "./pages/QuestionsBank";
import Modules from "./pages/Modules";
import Login from "./pages/Login";
import { About, AITools, Blog, Contact, FAQ, Guides, Pricing, Privacy, Terms } from "./pages/StaticPages";
import { Toaster } from "./components/ui/toaster";

const canonicalPath = (pathname) => {
  const aliases = {
    "/aitools": "/ai-tools",
    "/AITools": "/ai-tools",
    "/Modules": "/modules",
    "/Pricing": "/pricing",
    "/About": "/about",
    "/Contact": "/contact",
    "/PrivacyPolicy": "/privacy",
    "/Terms": "/terms",
  };
  return aliases[pathname] || (pathname === "/" ? "/" : pathname.toLowerCase());
};

const RouteMetadata = () => {
  const location = useLocation();
  const path = canonicalPath(location.pathname);
  const meta = getRouteMeta(path);
  return <SEO title={meta.title} description={meta.description} path={path} />;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <RouteMetadata />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/aitools" element={<AITools />} />
          <Route path="/AITools" element={<AITools />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/job-hunter" element={<JobHunter />} />
          <Route path="/questions-bank" element={<QuestionsBank />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/Modules" element={<Modules />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/Pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/About" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/PrivacyPolicy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
