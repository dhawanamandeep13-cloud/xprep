import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Rocket className="w-6 h-6 text-blue-400" />
              <span className="text-white">Xprep</span>
            </Link>
            <p className="text-sm mb-4">
              Your AI-powered career intelligence platform for interview preparation and job success.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/mock-interview" className="hover:text-blue-400 transition-colors">AI Mock Interview</Link></li>
              <li><Link to="/resume-builder" className="hover:text-blue-400 transition-colors">AI Resume Builder</Link></li>
              <li><Link to="/job-hunter" className="hover:text-blue-400 transition-colors">AI Job Hunter</Link></li>
              <li><Link to="/questions-bank" className="hover:text-blue-400 transition-colors">Questions Bank</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/modules" className="hover:text-blue-400 transition-colors">Learning Modules</Link></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link to="/guides" className="hover:text-blue-400 transition-colors">Interview Guides</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>© {currentYear} Xprep. All rights reserved. Built with ❤️ for career success.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
