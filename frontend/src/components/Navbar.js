import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Rocket, Menu, X, ChevronDown, Mic, FileText, Briefcase, BookOpen } from 'lucide-react';

const aiTools = [
  { name: 'AI Mock Interview', path: '/mock-interview', icon: Mic, desc: 'Practice with AI interviewer' },
  { name: 'AI Resume Builder', path: '/resume-builder', icon: FileText, desc: 'Build ATS-ready resumes' },
  { name: 'AI Job Hunter', path: '/job-hunter', icon: Briefcase, desc: 'Find matching jobs' },
  { name: 'Questions Bank', path: '/questions-bank', icon: BookOpen, desc: 'Browse interview questions' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
    setMobileToolsOpen(false);
  }, [location.pathname]);

  const isAIToolActive = aiTools.some(t => location.pathname === t.path);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Rocket className="w-6 h-6 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Xprep
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">

            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Home
            </Link>

            {/* AI Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-blue-600 ${
                  isAIToolActive ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                AI Tools
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  {aiTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors group ${
                          location.pathname === tool.path ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          location.pathname === tool.path ? 'bg-blue-600' : 'bg-blue-100 group-hover:bg-blue-200'
                        }`}>
                          <Icon className={`w-4 h-4 ${location.pathname === tool.path ? 'text-white' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${location.pathname === tool.path ? 'text-blue-600' : 'text-gray-800'}`}>
                            {tool.name}
                          </p>
                          <p className="text-xs text-gray-500">{tool.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              to="/modules"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/modules' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Modules
            </Link>

            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/pricing' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Pricing
            </Link>

          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-1">

              <Link to="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-blue-600 hover:bg-blue-50 ${location.pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}>
                Home
              </Link>

              {/* Mobile AI Tools Accordion */}
              <div>
                <button
                  onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 ${
                    isAIToolActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                  }`}
                >
                  AI Tools
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileToolsOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileToolsOpen && (
                  <div className="ml-3 mt-1 border-l-2 border-blue-100 pl-3 flex flex-col gap-1">
                    {aiTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors hover:text-blue-600 hover:bg-blue-50 ${
                            location.pathname === tool.path ? 'text-blue-600 font-semibold' : 'text-gray-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tool.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <Link to="/modules" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-blue-600 hover:bg-blue-50 ${location.pathname === '/modules' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}>
                Modules
              </Link>

              <Link to="/pricing" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-blue-600 hover:bg-blue-50 ${location.pathname === '/pricing' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}>
                Pricing
              </Link>

              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-gray-200">
                <Button variant="ghost" size="sm">Sign In</Button>
                <Button size="sm">Get Started</Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;