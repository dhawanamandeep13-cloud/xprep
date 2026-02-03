import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Briefcase, MapPin, DollarSign, Clock, TrendingUp, Search } from 'lucide-react';
import { jobListings } from '../mockData';

const JobHunter = () => {
  const [preferences, setPreferences] = useState({
    role: '',
    location: '',
    experience: '',
    jobType: 'full-time'
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleStartHunting = () => {
    setIsSearching(true);
    // Mock: In real implementation, this would trigger job search
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AI Job Hunter</h1>
            <p className="text-xl text-gray-600">
              Let AI find and apply to the best jobs for you automatically
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Settings */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Preferences</CardTitle>
                  <CardDescription>Tell us what you're looking for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="role">Desired Role</Label>
                    <Input
                      id="role"
                      placeholder="e.g., Software Engineer"
                      value={preferences.role}
                      onChange={(e) => setPreferences({...preferences, role: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Bangalore, Remote"
                      value={preferences.location}
                      onChange={(e) => setPreferences({...preferences, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select value={preferences.experience} onValueChange={(val) => setPreferences({...preferences, experience: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                        <SelectItem value="senior">Senior (6+ years)</SelectItem>
                        <SelectItem value="lead">Lead/Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="jobType">Job Type</Label>
                    <Select value={preferences.jobType} onValueChange={(val) => setPreferences({...preferences, jobType: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleStartHunting}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Start AI Job Hunt
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">AI Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <TrendingUp className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>Smart job matching based on your profile</span>
                    </li>
                    <li className="flex items-start">
                      <TrendingUp className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>Auto-customize resume for each application</span>
                    </li>
                    <li className="flex items-start">
                      <TrendingUp className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>Track all applications in one place</span>
                    </li>
                    <li className="flex items-start">
                      <TrendingUp className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>Get real-time status updates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Applications Sent</span>
                    <span className="font-bold text-blue-600">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Response Rate</span>
                    <span className="font-bold text-green-600">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Interviews</span>
                    <span className="font-bold text-purple-600">5</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recommended Jobs</CardTitle>
                      <CardDescription>AI-matched opportunities for you</CardDescription>
                    </div>
                    <Badge variant="secondary">32 New Today</Badge>
                  </div>
                </CardHeader>
              </Card>

              {jobListings.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <CardDescription className="text-lg font-semibold text-gray-900">
                            {job.company}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                        {job.match}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.posted}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Auto Apply with AI</Button>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="text-center">
                <Button variant="outline" size="lg">
                  Load More Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobHunter;
