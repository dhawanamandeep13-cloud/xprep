import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  FileText,
  Mail,
  MessageCircle,
  Mic,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/button';

const PageFrame = ({ eyebrow, title, description, children }) => (
  <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-normal text-slate-950 sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
      </div>
      {children}
    </div>
  </main>
);

export const AITools = () => {
  const tools = [
    ['AI Mock Interview', 'Practice role-specific interview rounds with structured AI feedback.', '/mock-interview', Mic],
    ['AI Resume Builder', 'Create, analyze and improve an ATS-ready resume for your target role.', '/resume-builder', FileText],
    ['AI Job Hunter', 'Organize job preferences and review matched opportunities in one workflow.', '/job-hunter', Briefcase],
    ['Question Bank', 'Practice behavioral, technical and situational questions before interviews.', '/questions-bank', BookOpen],
  ];

  return (
    <PageFrame
      eyebrow="AI tools"
      title="Career preparation tools that work together."
      description="Use Xprep to practice interviews, sharpen your resume, prepare questions and organize your job search without jumping between disconnected tools."
    >
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {tools.map(([title, description, href, Icon]) => (
          <Link key={title} to={href} className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <Icon className="h-8 w-8 text-blue-600" />
            <h2 className="mt-5 text-xl font-bold text-slate-950">{title}</h2>
            <p className="mt-3 text-slate-600">{description}</p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-blue-700">
              Open tool <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </PageFrame>
  );
};

export const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'For exploring Xprep and beginning interview practice.',
      features: ['Mock interview starter flow', 'Question bank preview', 'Basic resume guidance'],
      cta: 'Start free',
      href: '/mock-interview',
    },
    {
      name: 'Pro',
      price: 'Coming soon',
      description: 'For active job seekers who want deeper AI feedback and workflow tools.',
      features: ['Expanded interview sessions', 'CV vs JD analysis', 'Structured modules', 'Job-search workspace'],
      cta: 'Join waitlist',
      href: '/contact',
      featured: true,
    },
    {
      name: 'Teams',
      price: 'Custom',
      description: 'For colleges, placement teams and coaching programs.',
      features: ['Learner cohorts', 'Progress reporting', 'Custom preparation tracks', 'Support onboarding'],
      cta: 'Contact us',
      href: '/contact',
    },
  ];

  return (
    <PageFrame
      eyebrow="Pricing"
      title="Simple plans for every preparation stage."
      description="Keep pricing clear while the product grows. Start free, then upgrade when advanced practice and team workflows are ready."
    >
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className={`rounded-xl border bg-white p-6 shadow-sm ${plan.featured ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}>
            {plan.featured && <div className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Most requested</div>}
            <h2 className="text-xl font-bold text-slate-950">{plan.name}</h2>
            <div className="mt-4 text-3xl font-extrabold text-slate-950">{plan.price}</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-7 w-full rounded-lg" variant={plan.featured ? 'default' : 'outline'}>
              <Link to={plan.href}>{plan.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </PageFrame>
  );
};

export const About = () => (
  <PageFrame
    eyebrow="About"
    title="Xprep helps job seekers prepare with structure."
    description="Interview preparation is often scattered across notes, videos, resume drafts and job portals. Xprep brings those jobs into a single guided workspace."
  >
    <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
      {[
        ['Practice first', 'Users should learn by answering real prompts and improving with feedback.'],
        ['Be credible', 'Outcome claims should be backed by product evidence, testimonials or measured data.'],
        ['Respect user data', 'Resumes and career information should be handled carefully and transparently.'],
      ].map(([title, body]) => (
        <div key={title} className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-950">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
        </div>
      ))}
    </div>
  </PageFrame>
);

export const Contact = () => (
  <PageFrame
    eyebrow="Contact"
    title="Talk to the Xprep team."
    description="For support, partnerships, college programs or product feedback, reach out and include a short description of what you need."
  >
    <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
      <a href="mailto:support@xprep.in" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg">
        <Mail className="h-7 w-7 text-blue-600" />
        <h2 className="mt-4 font-bold text-slate-950">Email support</h2>
        <p className="mt-2 text-sm text-slate-600">support@xprep.in</p>
      </a>
      <Link to="/faq" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg">
        <MessageCircle className="h-7 w-7 text-blue-600" />
        <h2 className="mt-4 font-bold text-slate-950">Read the FAQ</h2>
        <p className="mt-2 text-sm text-slate-600">Find answers about tools, resumes, modules and pricing.</p>
      </Link>
    </div>
  </PageFrame>
);

export const Privacy = () => (
  <PageFrame
    eyebrow="Privacy"
    title="Privacy Policy"
    description="This page explains the data Xprep may collect and how it should be used to provide career preparation tools."
  >
    <PolicyContent
      sections={[
        ['Information users provide', 'Xprep may process account details, resume content, job descriptions, interview answers and preparation preferences to provide product features.'],
        ['How information is used', 'Data is used to generate feedback, improve workflows, provide support and maintain secure access to user workspaces.'],
        ['User control', 'Users should avoid uploading sensitive personal information that is not needed for resume or interview preparation. Contact support for deletion or account questions.'],
        ['Security', 'Career data should be protected with reasonable technical and organizational safeguards.'],
      ]}
    />
  </PageFrame>
);

export const Terms = () => (
  <PageFrame
    eyebrow="Terms"
    title="Terms of Service"
    description="These terms outline responsible use of Xprep career preparation tools."
  >
    <PolicyContent
      sections={[
        ['Educational guidance', 'Xprep provides preparation support and AI-generated suggestions. It does not guarantee job offers, interview outcomes or recruiter decisions.'],
        ['User responsibility', 'Users are responsible for reviewing AI-generated content before using it in resumes, applications or interviews.'],
        ['Acceptable use', 'Do not use Xprep to create misleading applications, impersonate others or upload content you do not have rights to use.'],
        ['Product changes', 'Features, pricing and availability may change as the platform evolves.'],
      ]}
    />
  </PageFrame>
);

const PolicyContent = ({ sections }) => (
  <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-6 flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
      <Shield className="h-5 w-5 flex-none" />
      This is a practical starter policy page. Have counsel review it before relying on it as a final legal document.
    </div>
    <div className="space-y-6">
      {sections.map(([title, body]) => (
        <section key={title}>
          <h2 className="font-bold text-slate-950">{title}</h2>
          <p className="mt-2 leading-7 text-slate-600">{body}</p>
        </section>
      ))}
    </div>
  </div>
);

export const Blog = () => (
  <PageFrame
    eyebrow="Blog"
    title="Career preparation notes."
    description="A home for practical interview, resume and job-search articles. Start with a few focused pieces that match your product tools."
  >
    <ResourceGrid
      items={[
        ['How to answer behavioral questions with structure', 'Use a clear context, action and result pattern without sounding scripted.'],
        ['What ATS tools look for in resumes', 'Make role fit obvious with keywords, evidence and clean formatting.'],
        ['How to prepare for campus placement interviews', 'Build a weekly practice rhythm across aptitude, HR and role questions.'],
      ]}
    />
  </PageFrame>
);

export const Guides = () => (
  <PageFrame
    eyebrow="Guides"
    title="Interview and resume guides."
    description="Short, actionable guides help visitors trust the product before they create an account."
  >
    <ResourceGrid
      items={[
        ['Mock interview checklist', 'Prepare role context, company notes, two projects and five strong examples.'],
        ['Resume review checklist', 'Check headline, summary, measurable achievements, keywords and formatting.'],
        ['Job application checklist', 'Track target roles, tailored resumes, follow-ups and interview notes.'],
      ]}
    />
  </PageFrame>
);

export const FAQ = () => (
  <PageFrame
    eyebrow="FAQ"
    title="Frequently asked questions."
    description="Quick answers for people deciding whether Xprep is useful for their preparation."
  >
    <div className="mx-auto mt-12 max-w-3xl divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {[
        ['Is Xprep free to start?', 'Yes. The site now points users to free practice first while advanced plans can be introduced clearly as they launch.'],
        ['Does Xprep guarantee a job?', 'No. Xprep helps users prepare and improve their materials, but hiring decisions depend on employers and individual performance.'],
        ['Can I upload my resume?', 'Yes, the resume builder supports resume upload and ATS-style analysis workflows.'],
        ['Who is Xprep for?', 'Students, freshers, early-career professionals and anyone preparing for interviews or job applications.'],
      ].map(([question, answer]) => (
        <div key={question} className="p-6">
          <h2 className="font-bold text-slate-950">{question}</h2>
          <p className="mt-2 leading-7 text-slate-600">{answer}</p>
        </div>
      ))}
    </div>
  </PageFrame>
);

const ResourceGrid = ({ items }) => (
  <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
    {items.map(([title, body]) => (
      <div key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Sparkles className="h-6 w-6 text-blue-600" />
        <h2 className="mt-4 font-bold text-slate-950">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
      </div>
    ))}
  </div>
);
