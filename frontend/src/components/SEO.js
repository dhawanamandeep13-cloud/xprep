import { useEffect } from 'react';

const siteUrl = 'https://www.xprep.in';

const routeMeta = {
  '/': {
    title: 'Xprep | AI Interview Practice, ATS Resume Builder and Career Prep',
    description:
      'Prepare for interviews with AI mock sessions, ATS resume feedback, interview questions, job-search tools and structured career modules.',
  },
  '/mock-interview': {
    title: 'AI Mock Interview Practice | Xprep',
    description:
      'Practice behavioral, technical and case interviews with AI-powered questions and feedback.',
  },
  '/resume-builder': {
    title: 'AI Resume Builder and ATS Resume Analysis | Xprep',
    description:
      'Build an ATS-ready resume, compare your CV with job descriptions and get AI suggestions tailored to your target role.',
  },
  '/job-hunter': {
    title: 'AI Job Hunter | Xprep',
    description:
      'Find relevant roles, compare job matches and organize your job-search workflow with Xprep.',
  },
  '/questions-bank': {
    title: 'Interview Questions Bank | Xprep',
    description:
      'Browse behavioral, technical and company-style interview questions with practice prompts.',
  },
  '/modules': {
    title: 'Career Preparation Modules | Xprep',
    description:
      'Build interview confidence with structured modules for communication, role research, negotiation and job search.',
  },
  '/pricing': {
    title: 'Pricing | Xprep',
    description:
      'Choose a Xprep plan for AI interviews, resume analysis, question practice and career preparation modules.',
  },
  '/ai-tools': {
    title: 'AI Career Tools | Xprep',
    description:
      'Explore Xprep AI tools for mock interviews, resume building, job matching and interview question practice.',
  },
  '/about': {
    title: 'About Xprep | Career Preparation Platform',
    description:
      'Learn how Xprep helps students, freshers and professionals prepare for interviews and career growth.',
  },
  '/contact': {
    title: 'Contact Xprep',
    description:
      'Contact Xprep for support, partnerships and product questions.',
  },
  '/privacy': {
    title: 'Privacy Policy | Xprep',
    description:
      'Read how Xprep handles account, resume and career preparation data.',
  },
  '/terms': {
    title: 'Terms of Service | Xprep',
    description:
      'Review the terms for using Xprep career preparation tools and services.',
  },
  '/blog': {
    title: 'Career Blog | Xprep',
    description:
      'Interview preparation, resume writing and job-search advice from Xprep.',
  },
  '/guides': {
    title: 'Interview Guides | Xprep',
    description:
      'Practical guides for interview preparation, resume optimization and job-search strategy.',
  },
  '/faq': {
    title: 'FAQ | Xprep',
    description:
      'Answers to common questions about Xprep AI interviews, resumes, modules and pricing.',
  },
  '/login': {
    title: 'Sign In | Xprep',
    description:
      'Sign in to your Xprep workspace for AI mock interviews, resume tools and learning modules.',
  },
};

export const getRouteMeta = (pathname) => {
  const normalized = pathname === '/' ? '/' : pathname.toLowerCase().replace(/\/$/, '');
  return routeMeta[normalized] || {
    title: 'Xprep | AI Career Preparation Platform',
    description:
      'AI-powered interview practice, resume feedback and career preparation tools for job seekers.',
  };
};

const setMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    if (selector.includes('property=')) {
      element.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
    } else {
      element.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
};

export default function SEO({ title, description, path = '/', type = 'website' }) {
  useEffect(() => {
    const canonicalUrl = `${siteUrl}${path === '/' ? '/' : path}`;
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', type);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    let jsonLd = document.head.querySelector('#xprep-jsonld');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.id = 'xprep-jsonld';
      jsonLd.type = 'application/ld+json';
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Xprep',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      url: siteUrl,
      description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
    });
  }, [title, description, path, type]);

  return null;
}
