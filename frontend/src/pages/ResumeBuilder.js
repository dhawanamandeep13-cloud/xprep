import React, { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { FileText, Download, Sparkles, Check, Upload, Loader2, AlertCircle, X, User, Briefcase, GraduationCap, Wrench } from 'lucide-react';
import APIService from '../services/api';

// ─── Upload Tab ────────────────────────────────────────────────────────────────
const UploadTab = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(f.type)) {
      setError('Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const readFileAsText = (f) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(f);
    });

  const handleAnalyze = async () => {
    if (!file) { setError('Please upload a resume file.'); return; }
    if (!targetRole.trim()) { setError('Please enter a target role.'); return; }
    setLoading(true);
    setError(null);
    try {
      const text = await readFileAsText(file);
      const result = await APIService.analyzeATS(text, targetRole);
      onAnalysisComplete(result, text);
    } catch (err) {
      setError(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-700">Drop your resume here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse — PDF, DOCX, or TXT</p>
            </div>
          </div>
        )}
      </div>

      {/* Target Role */}
      <div>
        <Label htmlFor="targetRole" className="text-sm font-semibold text-gray-700 mb-1 block">
          Target Role <span className="text-red-500">*</span>
        </Label>
        <Input
          id="targetRole"
          placeholder="e.g. Senior Financial Analyst, VP Finance, CA"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="h-11"
        />
        <p className="text-xs text-gray-500 mt-1">We'll tailor the ATS analysis to this role</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <Button
        onClick={handleAnalyze}
        disabled={loading || !file}
        className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing with AI...</>
        ) : (
          <><Sparkles className="w-5 h-5 mr-2" /> Analyze My Resume</>
        )}
      </Button>
    </div>
  );
};

// ─── ATS Results Panel ─────────────────────────────────────────────────────────
const ATSResults = ({ results }) => {
  if (!results) return null;
  const score = results.ats_score ?? results.score ?? 0;
  const scoreColor = score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';
  const barColor = score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          ATS Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score */}
        <div className="text-center py-2">
          <div className={`text-5xl font-bold ${scoreColor}`}>{score}%</div>
          <p className="text-sm text-gray-600 mt-1">ATS Compatibility Score</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
            <div className={`${barColor} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${score}%` }} />
          </div>
        </div>

        {/* Keywords */}
        {results.matched_keywords?.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">✅ Matched Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {results.matched_keywords.map((kw, i) => (
                <Badge key={i} className="bg-green-100 text-green-800 text-xs">{kw}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Missing Keywords */}
        {results.missing_keywords?.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">⚠️ Missing Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {results.missing_keywords.map((kw, i) => (
                <Badge key={i} className="bg-red-100 text-red-800 text-xs">{kw}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {results.suggestions?.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">💡 Recommendations</p>
            <ul className="space-y-1.5">
              {results.suggestions.map((s, i) => (
                <li key={i} className="flex items-start text-sm text-gray-700">
                  <Check className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ─── AI Suggestion Box ─────────────────────────────────────────────────────────
const AISuggestionBox = ({ suggestion, onUse, onDismiss }) => {
  if (!suggestion) return null;
  return (
    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-blue-700 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> AI Suggestion
        </p>
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
      <Button
        variant="link"
        size="sm"
        className="mt-2 p-0 h-auto text-blue-600 font-semibold"
        onClick={onUse}
      >
        ✓ Use this suggestion
      </Button>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState('build'); // 'build' | 'upload'
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', location: '',
    title: '', summary: '', experience: '', education: '', skills: ''
  });
  const [role, setRole] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [suggestions, setSuggestions] = useState({});
  const [loadingSection, setLoadingSection] = useState(null);
  const [sectionError, setSectionError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [atsResults, setATSResults] = useState(null);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  // Generate AI suggestion for a section
  const handleAISuggest = async (section) => {
    if (!role.trim()) {
      setSectionError('Please enter your target role first (top of form).');
      return;
    }
    setSectionError(null);
    setLoadingSection(section);
    try {
      const result = await APIService.generateResumeSuggestions(
        section,
        formData[section],
        role,
        parseInt(experienceYears) || 0
      );
      setSuggestions(prev => ({ ...prev, [section]: result.suggestion || result.content || result }));
    } catch (err) {
      setSectionError(`AI suggestion failed: ${err.message}`);
    } finally {
      setLoadingSection(null);
    }
  };

  const useSuggestion = (field, value) => {
    handleChange(field, typeof value === 'string' ? value : JSON.stringify(value));
    setSuggestions(prev => ({ ...prev, [field]: null }));
  };

  const dismissSuggestion = (field) => setSuggestions(prev => ({ ...prev, [field]: null }));

  // Analyze full resume from build tab
  const handleAnalyzeATS = async () => {
    if (!role.trim()) { setSectionError('Please enter a target role to analyze ATS.'); return; }
    setSectionError(null);
    setLoadingSection('ats');
    try {
      const resumeText = `${formData.fullName}\n${formData.title}\n\nSummary:\n${formData.summary}\n\nExperience:\n${formData.experience}\n\nEducation:\n${formData.education}\n\nSkills:\n${formData.skills}`;
      const result = await APIService.analyzeATS(resumeText, role);
      setATSResults(result);
    } catch (err) {
      setSectionError(`ATS analysis failed: ${err.message}`);
    } finally {
      setLoadingSection(null);
    }
  };

  const templates = [
    { id: 'modern', name: 'Modern', preview: 'Clean & professional' },
    { id: 'classic', name: 'Classic', preview: 'Traditional format' },
    { id: 'creative', name: 'Creative', preview: 'Stand-out design' },
    { id: 'minimal', name: 'Minimal', preview: 'Simple & elegant' },
  ];

  const SectionAIButton = ({ section }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleAISuggest(section)}
      disabled={loadingSection === section}
      className="flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
    >
      {loadingSection === section
        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
        : <><Sparkles className="w-3.5 h-3.5" /> AI Suggest</>
      }
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" /> AI-Powered Resume Builder
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Build Your Perfect Resume</h1>
            <p className="text-lg text-gray-600">Create an ATS-ready resume in minutes — or upload yours for instant analysis</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setActiveTab('build')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'build' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" /> Build from Scratch
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'upload' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="w-4 h-4" /> Upload & Analyze
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {sectionError && (
            <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {sectionError}
              <button onClick={() => setSectionError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* ── UPLOAD TAB ── */}
          {activeTab === 'upload' && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Your Resume</CardTitle>
                    <CardDescription>Get instant ATS score, keyword analysis, and AI recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UploadTab onAnalysisComplete={(result) => setATSResults(result)} />
                  </CardContent>
                </Card>
              </div>
              <div>
                {atsResults
                  ? <ATSResults results={atsResults} />
                  : (
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                      <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="font-semibold text-gray-700 mb-2">AI Analysis Ready</p>
                        <p className="text-sm text-gray-500">Upload your resume and enter a target role to see your ATS score, matched keywords, and personalized improvement tips.</p>
                      </CardContent>
                    </Card>
                  )
                }
              </div>
            </div>
          )}

          {/* ── BUILD TAB ── */}
          {activeTab === 'build' && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">

                {/* Target Role Banner */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-5">
                    <p className="text-sm font-semibold text-blue-800 mb-3">🎯 Set your target role — AI suggestions will be tailored to this</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-blue-700 font-semibold mb-1 block">Target Role *</Label>
                        <Input
                          placeholder="e.g. VP Finance, CA, CFO"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-blue-700 font-semibold mb-1 block">Years of Experience</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 20"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Your basic contact details</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="Rupinder Singh" value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="title">Professional Title</Label>
                        <Input id="title" placeholder="Chartered Accountant | VP Audit" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="New Delhi, India" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} />
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <div>
                          <CardTitle>Professional Summary</CardTitle>
                          <CardDescription>Compelling overview of your career</CardDescription>
                        </div>
                      </div>
                      <SectionAIButton section="summary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Brief overview of your professional experience and key achievements..."
                      rows={4}
                      value={formData.summary}
                      onChange={(e) => handleChange('summary', e.target.value)}
                    />
                    <AISuggestionBox
                      suggestion={suggestions.summary}
                      onUse={() => useSuggestion('summary', suggestions.summary)}
                      onDismiss={() => dismissSuggestion('summary')}
                    />
                  </CardContent>
                </Card>

                {/* Experience */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <div>
                          <CardTitle>Work Experience</CardTitle>
                          <CardDescription>Your professional history and achievements</CardDescription>
                        </div>
                      </div>
                      <SectionAIButton section="experience" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Company | Role | Duration&#10;• Key achievement with quantifiable result&#10;• Led a team of X to deliver Y..."
                      rows={7}
                      value={formData.experience}
                      onChange={(e) => handleChange('experience', e.target.value)}
                    />
                    <AISuggestionBox
                      suggestion={suggestions.experience}
                      onUse={() => useSuggestion('experience', suggestions.experience)}
                      onDismiss={() => dismissSuggestion('experience')}
                    />
                  </CardContent>
                </Card>

                {/* Education */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        <div>
                          <CardTitle>Education</CardTitle>
                          <CardDescription>Degrees and certifications</CardDescription>
                        </div>
                      </div>
                      <SectionAIButton section="education" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="CA | ICAI | 2004&#10;B.Com | Delhi University | 2002"
                      rows={3}
                      value={formData.education}
                      onChange={(e) => handleChange('education', e.target.value)}
                    />
                    <AISuggestionBox
                      suggestion={suggestions.education}
                      onUse={() => useSuggestion('education', suggestions.education)}
                      onDismiss={() => dismissSuggestion('education')}
                    />
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-blue-600" />
                        <div>
                          <CardTitle>Skills</CardTitle>
                          <CardDescription>Technical and soft skills</CardDescription>
                        </div>
                      </div>
                      <SectionAIButton section="skills" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Financial Reporting, Audit, Risk Management, IFRS, SAP..."
                      rows={3}
                      value={formData.skills}
                      onChange={(e) => handleChange('skills', e.target.value)}
                    />
                    <AISuggestionBox
                      suggestion={suggestions.skills}
                      onUse={() => useSuggestion('skills', suggestions.skills)}
                      onDismiss={() => dismissSuggestion('skills')}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Template Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Choose Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {templates.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTemplate(t.id)}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${
                            selectedTemplate === t.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                        >
                          <div className="font-semibold text-sm">{t.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{t.preview}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* ATS Score / Analyze Button */}
                <Card className={`${atsResults ? 'border-green-200 bg-gradient-to-br from-green-50 to-blue-50' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
                  <CardHeader>
                    <CardTitle className="text-base">ATS Compatibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {atsResults ? (
                      <ATSResults results={atsResults} />
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">Check how well your resume matches your target role's ATS requirements</p>
                        <Button
                          onClick={handleAnalyzeATS}
                          disabled={loadingSection === 'ats'}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          size="sm"
                        >
                          {loadingSection === 'ats'
                            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                            : <><Sparkles className="w-4 h-4 mr-2" /> Analyze ATS Score</>
                          }
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="pt-6 space-y-2">
                    <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold">
                      <FileText className="w-4 h-4 mr-2" /> Preview Resume
                    </Button>
                    <Button variant="outline" className="w-full h-11 font-semibold">
                      <Download className="w-4 h-4 mr-2" /> Download PDF
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
