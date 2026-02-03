import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileText, Download, Sparkles, Check } from 'lucide-react';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    title: '',
    summary: '',
    experience: '',
    education: '',
    skills: ''
  });
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateAISuggestions = () => {
    // Mock AI suggestions
    setAiSuggestions({
      summary: 'Results-driven professional with 5+ years of experience in software development. Proven track record of delivering high-impact solutions and leading cross-functional teams.',
      skills: ['Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker', 'Agile'],
      improvements: [
        'Add quantifiable achievements to experience section',
        'Include relevant certifications',
        'Optimize keywords for ATS compatibility'
      ]
    });
  };

  const templates = [
    { id: 'modern', name: 'Modern', preview: 'Clean and professional' },
    { id: 'classic', name: 'Classic', preview: 'Traditional format' },
    { id: 'creative', name: 'Creative', preview: 'Stand out design' },
    { id: 'minimal', name: 'Minimal', preview: 'Simple and elegant' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AI Resume Builder</h1>
            <p className="text-xl text-gray-600">
              Create an ATS-ready resume in minutes with AI-powered suggestions
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Start with your basic details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        placeholder="Senior Software Engineer"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Professional Summary</CardTitle>
                      <CardDescription>Describe your professional background</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleGenerateAISuggestions}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Generate
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Brief overview of your professional experience and key achievements..."
                    rows={4}
                    value={formData.summary}
                    onChange={(e) => handleChange('summary', e.target.value)}
                  />
                  {aiSuggestions && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold mb-2 text-blue-700">AI Suggestion:</p>
                      <p className="text-sm text-gray-700">{aiSuggestions.summary}</p>
                      <Button variant="link" size="sm" className="mt-2 p-0">
                        Use this suggestion
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>List your relevant work experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Company, Role, Duration, and Key Achievements..."
                    rows={6}
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Your educational background</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Degree, Institution, Year..."
                    rows={3}
                    value={formData.education}
                    onChange={(e) => handleChange('education', e.target.value)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Technical and soft skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="List your key skills..."
                    rows={3}
                    value={formData.skills}
                    onChange={(e) => handleChange('skills', e.target.value)}
                  />
                  {aiSuggestions && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold mb-2">AI Suggested Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {aiSuggestions.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="cursor-pointer hover:bg-blue-100">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Template Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Choose Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <div className="font-semibold text-sm mb-1">{template.name}</div>
                        <div className="text-xs text-gray-600">{template.preview}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ATS Score */}
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg">ATS Compatibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
                    <p className="text-sm text-gray-600 mb-4">Your resume is ATS-friendly</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Improvements */}
              {aiSuggestions && (
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {aiSuggestions.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <Check className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Button className="w-full" size="lg">
                      <FileText className="w-4 h-4 mr-2" />
                      Preview Resume
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
