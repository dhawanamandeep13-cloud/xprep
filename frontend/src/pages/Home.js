import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  FileText,
  Mic,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../components/ui/button';

const tools = [
  {
    title: 'AI Mock Interview',
    description: 'Practice role-specific interview questions and get structured feedback on clarity, confidence and content.',
    href: '/mock-interview',
    icon: Mic,
    stat: 'Live practice',
    accent: 'bg-blue-600',
  },
  {
    title: 'Resume Builder',
    description: 'Build an ATS-ready resume, analyze gaps and tailor your CV to a target role or job description.',
    href: '/resume-builder',
    icon: FileText,
    stat: 'ATS feedback',
    accent: 'bg-emerald-600',
  },
  {
    title: 'Job Hunter',
    description: 'Organize preferences, compare matched roles and prepare a focused application workflow.',
    href: '/job-hunter',
    icon: Briefcase,
    stat: 'Role matching',
    accent: 'bg-indigo-600',
  },
  {
    title: 'Question Bank',
    description: 'Practice common behavioral, technical and company-style interview questions before the real round.',
    href: '/questions-bank',
    icon: BookOpen,
    stat: 'Guided prep',
    accent: 'bg-cyan-700',
  },
];

const proofPoints = [
  { label: 'Interview practice', value: 'AI-led', icon: Mic },
  { label: 'Resume checks', value: 'ATS-aware', icon: ShieldCheck },
  { label: 'Learning paths', value: 'Structured', icon: Target },
];

const steps = [
  ['Create profile', 'Set your target role, experience level and current preparation stage.'],
  ['Practice daily', 'Use mock interviews, question sets and modules to close skill gaps.'],
  ['Improve resume', 'Analyze your CV, compare it with JDs and refine the story recruiters see.'],
  ['Apply smarter', 'Use a focused workflow to prepare for roles that match your goals.'],
];

const testimonials = [
  {
    quote: 'The mock interviews helped me structure answers and stop rambling under pressure.',
    name: 'Finance analyst candidate',
    role: 'Interview preparation user',
  },
  {
    quote: 'The CV review made it clear which skills were missing for the role I wanted.',
    name: 'Graduate job seeker',
    role: 'Resume analysis user',
  },
  {
    quote: 'Having questions, modules and resume tools in one place made preparation less scattered.',
    name: 'Campus placement candidate',
    role: 'Learning modules user',
  },
];

const Home = () => {
  return (
    <main className="overflow-x-hidden bg-white pt-16 text-slate-950">
      <section className="relative border-b border-slate-200 bg-[linear-gradient(#eef4ff_1px,transparent_1px),linear-gradient(90deg,#eef4ff_1px,transparent_1px)] bg-[size:48px_48px]">
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Sparkles className="h-4 w-4" />
              AI-powered career preparation
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              Get interview ready. Build a stronger resume. Apply with confidence.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Xprep brings mock interviews, ATS resume feedback, structured learning modules and job-search tools into one practical workspace for students, freshers and professionals.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-lg bg-blue-600 px-6 text-base hover:bg-blue-700">
                <Link to="/mock-interview">
                  Start free practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-lg px-6 text-base">
                <Link to="/ai-tools">
                  <Play className="mr-2 h-4 w-4" />
                  Explore tools
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {proofPoints.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <Icon className="mb-3 h-5 w-5 text-blue-600" />
                  <div className="text-lg font-bold text-slate-950">{value}</div>
                  <div className="text-sm text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-blue-950/10">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="text-sm font-semibold text-slate-500">Preparation score</div>
                  <div className="mt-1 text-3xl font-extrabold text-slate-950">78%</div>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  Improving
                </div>
              </div>
              <div className="grid gap-3 py-5">
                {[
                  ['Mock interview', 'Behavioral round practice', '72%', Mic],
                  ['Resume quality', 'ATS gaps identified', '84%', FileText],
                  ['Role research', 'Company prep module', '65%', Search],
                ].map(([title, sub, value, Icon]) => (
                  <div key={title} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-slate-950">{title}</p>
                          <span className="text-sm font-bold text-slate-700">{value}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{sub}</p>
                        <div className="mt-3 h-2 rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-blue-600" style={{ width: value }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-slate-950 p-4 text-white">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-200">
                  <Award className="h-4 w-4" />
                  Next best action
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Practice two STAR answers and update the resume summary for your target role.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-700">AI tools</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-normal text-slate-950 sm:text-4xl">
              One workspace for the messy middle of career preparation.
            </h2>
            <p className="mt-4 text-slate-600">
              Each tool solves a real preparation job, from first practice answer to final application polish.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map(({ title, description, href, icon: Icon, stat, accent }) => (
              <Link key={title} to={href} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg text-white ${accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-3 min-h-24 text-sm leading-6 text-slate-600">{description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold">
                  <span className="text-slate-500">{stat}</span>
                  <span className="inline-flex items-center text-blue-700">
                    Open <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">How it works</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-normal text-slate-950 sm:text-4xl">
                A practical preparation loop.
              </h2>
              <p className="mt-4 text-slate-600">
                Xprep is designed around repeated practice and clear next steps, not one-time advice.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {steps.map(([title, description], index) => (
                <div key={title} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-300">Proof and trust</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-normal sm:text-4xl">
                Strong claims should be easy to believe.
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                The site now uses more careful outcome language. Add verified customer logos, measured case studies or anonymized screenshots here as your data grows.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['No credit card to start', 'Resume data stays user-controlled', 'Built for interview practice'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-3 flex gap-1 text-amber-300">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-slate-200">"{item.quote}"</p>
                  <div className="mt-5 text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <TrendingUp className="mx-auto h-10 w-10 text-blue-600" />
          <h2 className="mt-4 text-3xl font-extrabold tracking-normal text-slate-950 sm:text-4xl">
            Start with one free mock interview.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            The fastest way to understand Xprep is to answer a real question and see the feedback loop.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="h-12 rounded-lg bg-blue-600 px-6 text-base hover:bg-blue-700">
              <Link to="/mock-interview">
                Start free practice
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
