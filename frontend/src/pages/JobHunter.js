import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertCircle, ArrowUpRight, Briefcase, Building2, CheckCircle2, Clock, ExternalLink, MapPin, Search, Sparkles, X } from 'lucide-react';
import APIService from '../services/api';

const EXPERIENCE_LEVELS = [
  ['entry', 'Fresher / Entry level (0–2 years)'],
  ['mid', 'Mid level (3–5 years)'],
  ['senior', 'Senior (6–10 years)'],
  ['lead', 'Lead / Manager (10+ years)'],
];

const JobHunter = () => {
  const [preferences, setPreferences] = useState({
    role: '', location: 'India', experience_level: 'mid', job_type: 'full-time', work_mode: 'any', skills: '',
  });
  const [jobs, setJobs] = useState([]);
  const [searchLinks, setSearchLinks] = useState([]);
  const [searchMessage, setSearchMessage] = useState('');
  const [liveResults, setLiveResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const updatePreference = (field, value) => setPreferences((current) => ({ ...current, [field]: value }));

  const handleStartHunting = async () => {
    if (!preferences.role.trim()) {
      setError('Enter the role you want to target first.');
      return;
    }
    setIsSearching(true);
    setError('');
    try {
      const result = await APIService.searchJobs({
        ...preferences,
        skills: preferences.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      });
      setJobs(result.jobs || []);
      setSearchLinks(result.search_links || []);
      setSearchMessage(result.message || 'Search complete.');
      setLiveResults(Boolean(result.live_results));
    } catch (err) {
      setError(err.message || 'Job search could not be completed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4"><Sparkles className="w-4 h-4" /> India-focused job search</div>
            <h1 className="text-4xl font-bold mb-3">AI Job Hunter</h1>
            <p className="text-lg text-gray-600">Search verified opportunities and launch tailored searches across India’s leading job boards.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <aside className="space-y-6">
              <Card className="border-blue-100">
                <CardHeader><CardTitle>Search preferences</CardTitle><CardDescription>Use a specific title and your strongest skills for better matches.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div><Label htmlFor="role">Target role <span className="text-red-500">*</span></Label><Input id="role" className="mt-1" placeholder="e.g. Financial Analyst" value={preferences.role} onChange={(event) => updatePreference('role', event.target.value)} /></div>
                  <div><Label htmlFor="location">Preferred location</Label><Input id="location" className="mt-1" placeholder="e.g. Bengaluru, Mumbai, Remote" value={preferences.location} onChange={(event) => updatePreference('location', event.target.value)} /></div>
                  <div><Label htmlFor="skills">Key skills</Label><Input id="skills" className="mt-1" placeholder="Excel, Power BI, FP&A" value={preferences.skills} onChange={(event) => updatePreference('skills', event.target.value)} /><p className="text-xs text-gray-500 mt-1">Separate skills with commas.</p></div>
                  <div><Label>Experience level</Label><Select value={preferences.experience_level} onValueChange={(value) => updatePreference('experience_level', value)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{EXPERIENCE_LEVELS.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Job type</Label><Select value={preferences.job_type} onValueChange={(value) => updatePreference('job_type', value)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="full-time">Full-time</SelectItem><SelectItem value="contract">Contract</SelectItem><SelectItem value="part-time">Part-time</SelectItem><SelectItem value="internship">Internship</SelectItem></SelectContent></Select></div>
                  <div><Label>Work arrangement</Label><Select value={preferences.work_mode} onValueChange={(value) => updatePreference('work_mode', value)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any arrangement</SelectItem><SelectItem value="onsite">On-site</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem><SelectItem value="remote">Remote</SelectItem></SelectContent></Select></div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleStartHunting} disabled={isSearching}>{isSearching ? <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" /> Searching verified sources...</> : <><Search className="w-4 h-4 mr-2" /> Find jobs</>}</Button>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"><CardContent className="pt-6 text-sm text-gray-700 space-y-3"><p className="font-semibold text-gray-900">How matching works</p><p>Matches consider your target role, skills, and preferred location. Xprep never fabricates job listings or submits applications without your approval.</p><p className="text-xs text-gray-500">Always review the job description and employer before applying.</p></CardContent></Card>
            </aside>

            <main className="lg:col-span-2 space-y-5">
              {error && <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="w-4 h-4 shrink-0" />{error}<button className="ml-auto" onClick={() => setError('')}><X className="w-4 h-4" /></button></div>}
              {!searchMessage && !isSearching && <Card className="border-dashed border-blue-200 bg-blue-50/50"><CardContent className="py-16 text-center"><Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-4" /><p className="font-semibold text-gray-800">Ready to search India’s job market</p><p className="text-sm text-gray-600 mt-2">Enter a role, location, and skills to begin.</p></CardContent></Card>}
              {searchMessage && <Card className="border-blue-200"><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>Job search results</CardTitle><CardDescription className="mt-1">{searchMessage}</CardDescription></div><Badge className={liveResults ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>{liveResults ? 'Live listings' : 'Board searches ready'}</Badge></div></CardHeader></Card>}

              {jobs.map((job) => <Card key={job.id || `${job.company}-${job.title}`} className="hover:shadow-md transition-shadow"><CardHeader><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><div className="w-11 h-11 shrink-0 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">{job.company?.charAt(0) || 'J'}</div><div><CardTitle className="text-lg">{job.title}</CardTitle><CardDescription className="font-medium text-gray-800 mt-1">{job.company}</CardDescription></div></div><Badge className="bg-green-100 text-green-800 shrink-0">{job.match_score}% match</Badge></div></CardHeader><CardContent><div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-3"><span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{job.location}</span><span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" />{job.job_type}</span><span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{job.posted}</span></div>{job.description && <p className="text-sm text-gray-600 line-clamp-3 mb-3">{job.description}</p>}<div className="flex flex-wrap gap-2 mb-4">{(job.match_reasons || []).map((reason) => <Badge key={reason} variant="secondary" className="font-normal"><CheckCircle2 className="w-3 h-3 mr-1" />{reason}</Badge>)}</div>{job.apply_url && <Button asChild className="bg-blue-600 hover:bg-blue-700"><a href={job.apply_url} target="_blank" rel="noreferrer">View & apply on {job.source || 'job board'} <ExternalLink className="w-4 h-4 ml-2" /></a></Button>}</CardContent></Card>)}

              {searchLinks.length > 0 && <Card><CardHeader><CardTitle className="text-lg">Continue your search on India job boards</CardTitle><CardDescription>These links use your selected role, skills, and location.</CardDescription></CardHeader><CardContent className="grid sm:grid-cols-2 gap-3">{searchLinks.map((link) => <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"><div className="flex items-center justify-between gap-2"><span className="font-semibold text-gray-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600" />{link.name}</span><ArrowUpRight className="w-4 h-4 text-blue-600" /></div><p className="text-xs text-gray-500 mt-2">{link.description}</p></a>)}</CardContent></Card>}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobHunter;
