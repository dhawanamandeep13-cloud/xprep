import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Mail, Rocket, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Rocket className="h-6 w-6 text-blue-400" />
              <span className="text-white">Xprep</span>
            </Link>
            <p className="mb-4 text-sm leading-6">
              AI-powered interview practice, resume feedback and career preparation tools for job seekers.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com/xprep" aria-label="Xprep on Twitter" className="transition-colors hover:text-blue-400">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/xprep" aria-label="Xprep on LinkedIn" className="transition-colors hover:text-blue-400">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:support@xprep.in" aria-label="Email Xprep support" className="transition-colors hover:text-blue-400">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/mock-interview" className="transition-colors hover:text-blue-400">AI Mock Interview</Link></li>
              <li><Link to="/resume-builder" className="transition-colors hover:text-blue-400">AI Resume Builder</Link></li>
              <li><Link to="/job-hunter" className="transition-colors hover:text-blue-400">AI Job Hunter</Link></li>
              <li><Link to="/questions-bank" className="transition-colors hover:text-blue-400">Questions Bank</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/modules" className="transition-colors hover:text-blue-400">Learning Modules</Link></li>
              <li><Link to="/blog" className="transition-colors hover:text-blue-400">Blog</Link></li>
              <li><Link to="/guides" className="transition-colors hover:text-blue-400">Interview Guides</Link></li>
              <li><Link to="/faq" className="transition-colors hover:text-blue-400">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="transition-colors hover:text-blue-400">About Us</Link></li>
              <li><Link to="/pricing" className="transition-colors hover:text-blue-400">Pricing</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-blue-400">Contact</Link></li>
              <li><Link to="/privacy" className="transition-colors hover:text-blue-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="transition-colors hover:text-blue-400">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm">
          <p>Copyright {currentYear} Xprep. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
