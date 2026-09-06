import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertCircle, ArrowUpRight, Briefcase, Building2, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock, ExternalLink, MapPin, Search, Sparkles, X } from 'lucide-react';
import APIService from '../services/api';

const COUNTRIES = ['India', 'United Arab Emirates', 'Singapore', 'United Kingdom', 'United States'];
const INDIA_STATES = ['Any state', 'Andhra Pradesh', 'Delhi NCR', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];
const INDUSTRIES = ['Any industry', 'Banking & Financial Services', 'Insurance', 'Manufacturing', 'Information Technology', 'BPO / KPO', 'Consulting', 'Healthcare & Pharmaceuticals', 'Retail & E-commerce', 'Logistics & Supply Chain', 'Telecom', 'Education'];
const DOMAINS = ['Any domain', 'Finance & Accounting', 'Banking', 'Insurance', 'Risk & Compliance', 'Technology', 'Data & Analytics', 'Operations', 'Sales & Business Development', 'Human Resources', 'Customer Service', 'Procurement'];
const SKILL_GROUPS = {
  'Finance & Banking': ['Financial Analysis', 'FP&A', 'Financial Modelling', 'Budgeting', 'Accounting', 'Audit', 'Risk Management', 'Credit Analysis', 'Excel', 'Power BI'],
  Technology: ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'AWS', 'Azure', 'DevOps', 'Cybersecurity'],
  Business: ['Data Analysis', 'Project Management', 'Business Analysis', 'Salesforce', 'CRM', 'Operations Management', 'Supply Chain', 'Digital Marketing'],
};
const EXPERIENCE_LEVELS = [['entry', 'Fresher / Entry level (0–2 years)'], ['mid', 'Mid level (3–5 years)'], ['senior', 'Senior (6–10 years)'], ['lead', 'Lead / Manager (10+ years)']];

const JobHunter = () => {
  const [preferences, setPreferences] = useState({ role: '', country: 'India', state: 'Any state', experience_level: 'mid', job_type: 'full-time', work_mode: 'any', industry: 'Any industry', domain: 'Any domain', skills: [] });
  const [jobs, setJobs] = useState([]);
  const [searchLinks, setSearchLinks] = useState([]);
  const [searchMessage, setSearchMessage] = useState('');
  const [liveResults, setLiveResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [expandedJobIds, setExpandedJobIds] = useState({});

  const update = (field, value) => setPreferences((current) => ({ ...current, [field]: value }));
  const toggleSkill = (skill) => setPreferences((current) => ({ ...current, skills: current.skills.includes(skill) ? current.skills.filter((item) => item !== skill) : [...current.skills, skill] }));
  const searchLocation = () => preferences.country === 'India' && preferences.state !== 'Any state' ? `${preferences.state}, India` : preferences.country;

  const searchJobs = async (requestedPage = 1) => {
    if (!preferences.role.trim()) { setError('Enter the role you want to target first.'); return; }
    setIsSearching(true); setError('');
    try {
      const result = await APIService.searchJobs({ ...preferences, location: searchLocation(), state: preferences.state === 'Any state' ? '' : preferences.state, industry: preferences.industry === 'Any industry' ? '' : preferences.industry, domain: preferences.domain === 'Any domain' ? '' : preferences.domain }, requestedPage, 15);
      setJobs(result.jobs || []); setSearchLinks(result.search_links || []); setSearchMessage(result.message || 'Search complete.'); setLiveResults(Boolean(result.live_results)); setPage(result.page || requestedPage); setHasMore(Boolean(result.has_more)); setTotalResults(result.total_results || 0); setExpandedJobIds({});
    } catch (err) { setError(err.message || 'Job search could not be completed. Please try again.'); }
    finally { setIsSearching(false); }
  };

  const changeCountry = (country) => setPreferences((current) => ({ ...current, country, state: country === 'India' ? 'Any state' : '' }));
  const stateOptions = preferences.country === 'India' ? INDIA_STATES : ['Any state'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16"><div className="container mx-auto px-4"><div className="max-w-6xl mx-auto">
      <div className="text-center mb-10"><div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4"><Sparkles className="w-4 h-4" /> India-first job search</div><h1 className="text-4xl font-bold mb-3">AI Job Hunter</h1><p className="text-lg text-gray-600">Find relevant roles with precise filters, verified listings, and direct application links.</p></div>
      <div className="grid lg:grid-cols-3 gap-8">
        <aside className="space-y-6"><Card className="border-blue-100"><CardHeader><CardTitle>Search preferences</CardTitle><CardDescription>Choose the filters that matter for your next role.</CardDescription></CardHeader><CardContent className="space-y-4">
          <div><Label htmlFor="role">Target role <span className="text-red-500">*</span></Label><Input id="role" className="mt-1" placeholder="e.g. Financial Analyst" value={preferences.role} onChange={(event) => update('role', event.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3"><div><Label>Country</Label><Select value={preferences.country} onValueChange={changeCountry}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{COUNTRIES.map((country) => <SelectItem key={country} value={country}>{country}</SelectItem>)}</SelectContent></Select></div><div><Label>State / region</Label><Select value={preferences.state || 'Any state'} onValueChange={(value) => update('state', value)} disabled={preferences.country !== 'India'}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{stateOptions.map((state) => <SelectItem key={state} value={state}>{state}</SelectItem>)}</SelectContent></Select></div></div>
          <div><Label>Industry</Label><Select value={preferences.industry} onValueChange={(value) => update('industry', value)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{INDUSTRIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Domain / business function</Label><Select value={preferences.domain} onValueChange={(value) => update('domain', value)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{DOMAINS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Key skills</Label><details className="group mt-1 rounded-md border border-input bg-background"><summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm"><span>{preferences.skills.length ? `${preferences.skills.length} skill${preferences.skills.length === 1 ? '' : 's'} selected` : 'Choose one or more skills'}</span><ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" /></summary><div className="max-h-64 overflow-y-auto border-t p-3 space-y-4">{Object.entries(SKILL_GROUPS).map(([group, skills]) => <div key={group}><p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{group}</p><div className="grid grid-cols-2 gap-2">{skills.map((skill) => <label key={skill} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><Checkbox checked={preferences.skills.includes(skill)} onCheckedChange={() => toggleSkill(skill)} />{skill}</label>)}</div></div>)}</div></details>{preferences.skills.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{preferences.skills.map((skill) => <Badge key={skill} variant="secondary" className="gap-1">{skill}<button aria-label={`Remove ${skill}`} onClick={() => toggleSkill(skill)}><X className="w-3 h-3" /></button></Badge>)}<button className="text-xs text-blue-600" onClick={() => update('skills', [])}>Clear</button></div>}</div>
          <div><Label>Experience level</Label><Select value={preferences.experience_level} onValueChange={(value) => update('experience_level', value)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{EXPERIENCE_LEVELS.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid grid-cols-2 gap-3"><div><Label>Job type</Label><Select value={preferences.job_type} onValueChange={(value) => update('job_type', value)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="full-time">Full-time</SelectItem><SelectItem value="contract">Contract</SelectItem><SelectItem value="part-time">Part-time</SelectItem><SelectItem value="internship">Internship</SelectItem></SelectContent></Select></div><div><Label>Work arrangement</Label><Select value={preferences.work_mode} onValueChange={(value) => update('work_mode', value)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem><SelectItem value="onsite">On-site</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem><SelectItem value="remote">Remote</SelectItem></SelectContent></Select></div></div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={() => searchJobs(1)} disabled={isSearching}>{isSearching ? <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" /> Searching...</> : <><Search className="w-4 h-4 mr-2" /> Find jobs</>}</Button>
        </CardContent></Card><Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"><CardContent className="pt-6 text-sm text-gray-700"><p className="font-semibold text-gray-900 mb-2">Search safely</p><p>Xprep ranks provider-sourced opportunities, but you decide whether to apply. Always review the job description and employer first.</p></CardContent></Card></aside>
        <main className="lg:col-span-2 space-y-5">
          {error && <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="w-4 h-4 shrink-0" />{error}<button className="ml-auto" onClick={() => setError('')}><X className="w-4 h-4" /></button></div>}
          {!searchMessage && !isSearching && <Card className="border-dashed border-blue-200 bg-blue-50/50"><CardContent className="py-16 text-center"><Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-4" /><p className="font-semibold text-gray-800">Ready to search</p><p className="text-sm text-gray-600 mt-2">Set your preferences to find roles across India and beyond.</p></CardContent></Card>}
          {searchMessage && <Card className="border-blue-200"><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>Job search results</CardTitle><CardDescription className="mt-1">{searchMessage}{liveResults && totalResults ? ` ${totalResults.toLocaleString()} results found.` : ''}</CardDescription></div><Badge className={liveResults ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>{liveResults ? 'Live listings' : 'Board searches ready'}</Badge></div></CardHeader></Card>}
          {jobs.map((job) => { const expanded = expandedJobIds[job.id]; return <Card key={job.id || `${job.company}-${job.title}`} className="hover:shadow-md transition-shadow"><CardHeader><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><div className="w-11 h-11 shrink-0 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">{job.company?.charAt(0) || 'J'}</div><div><CardTitle className="text-lg">{job.title}</CardTitle><CardDescription className="font-medium text-gray-800 mt-1">{job.company}</CardDescription></div></div><Badge className="bg-green-100 text-green-800 shrink-0">{job.match_score}% match</Badge></div></CardHeader><CardContent><div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-3"><span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{job.location}</span><span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" />{job.job_type}</span><span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{job.posted}</span></div><p className={`whitespace-pre-wrap text-sm text-gray-600 mb-3 ${expanded ? '' : 'line-clamp-3'}`}>{job.description || 'No description provided by the job source.'}</p>{job.description && job.description.length > 280 && <button onClick={() => setExpandedJobIds((current) => ({ ...current, [job.id]: !expanded }))} className="text-sm font-medium text-blue-600 mb-3">{expanded ? 'Show less' : 'Read full description'}</button>}<div className="flex flex-wrap gap-2 mb-4">{(job.match_reasons || []).map((reason) => <Badge key={reason} variant="secondary" className="font-normal"><CheckCircle2 className="w-3 h-3 mr-1" />{reason}</Badge>)}</div>{job.apply_url && <Button asChild className="bg-blue-600 hover:bg-blue-700"><a href={job.apply_url} target="_blank" rel="noreferrer">View details & apply <ExternalLink className="w-4 h-4 ml-2" /></a></Button>}</CardContent></Card>; })}
          {liveResults && jobs.length > 0 && <div className="flex items-center justify-between rounded-xl border bg-white p-3"><Button variant="outline" disabled={page === 1 || isSearching} onClick={() => searchJobs(page - 1)}><ChevronLeft className="w-4 h-4 mr-1" /> Previous</Button><span className="text-sm text-gray-600">Page {page}{totalResults ? ` of ${Math.ceil(totalResults / 15)}` : ''}</span><Button variant="outline" disabled={!hasMore || isSearching} onClick={() => searchJobs(page + 1)}>Next <ChevronRight className="w-4 h-4 ml-1" /></Button></div>}
          {searchLinks.length > 0 && <Card><CardHeader><CardTitle className="text-lg">Search more India job boards</CardTitle><CardDescription>Your filters are included in these searches.</CardDescription></CardHeader><CardContent className="grid sm:grid-cols-2 gap-3">{searchLinks.map((link) => <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"><div className="flex items-center justify-between gap-2"><span className="font-semibold text-gray-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600" />{link.name}</span><ArrowUpRight className="w-4 h-4 text-blue-600" /></div><p className="text-xs text-gray-500 mt-2">{link.description}</p></a>)}</CardContent></Card>}
        </main>
      </div>
    </div></div></div>
  );
};

export default JobHunter;
