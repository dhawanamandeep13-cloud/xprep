import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Filter, BookOpen, Building2, TrendingUp } from 'lucide-react';
import { mockInterviewQuestions } from '../mockData';

const QuestionsBank = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions', count: 2500 },
    { id: 'behavioral', name: 'Behavioral', count: 850 },
    { id: 'technical', name: 'Technical', count: 920 },
    { id: 'case', name: 'Case Studies', count: 340 },
    { id: 'situational', name: 'Situational', count: 390 }
  ];

  const topCompanies = [
    { name: 'Google', questions: 450, logo: 'G' },
    { name: 'Amazon', questions: 420, logo: 'A' },
    { name: 'Microsoft', questions: 380, logo: 'M' },
    { name: 'Meta', questions: 350, logo: 'F' },
    { name: 'Apple', questions: 320, logo: 'A' },
    { name: 'Netflix', questions: 280, logo: 'N' }
  ];

  const allQuestions = [
    ...mockInterviewQuestions,
    {
      id: 4,
      question: 'What are your greatest strengths?',
      category: 'Behavioral',
      difficulty: 'Easy',
      companies: ['Google', 'Amazon', 'Apple']
    },
    {
      id: 5,
      question: 'Explain a time when you had to deal with conflict in a team',
      category: 'Behavioral',
      difficulty: 'Medium',
      companies: ['Microsoft', 'Meta', 'Google']
    },
    {
      id: 6,
      question: 'How do you prioritize tasks when everything is urgent?',
      category: 'Behavioral',
      difficulty: 'Medium',
      companies: ['Amazon', 'Apple', 'Netflix']
    }
  ];

  const filteredQuestions = allQuestions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || q.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Interview Questions Bank</h1>
            <p className="text-xl text-gray-600">
              Access thousands of real interview questions from top companies
            </p>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search questions..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{category.name}</span>
                          <Badge variant="secondary" className="text-xs">{category.count}</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Companies */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCompanies.map((company) => (
                      <div key={company.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {company.logo}
                          </div>
                          <span className="text-sm font-medium">{company.name}</span>
                        </div>
                        <span className="text-xs text-gray-600">{company.questions}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Questions Practiced</span>
                      <span className="font-bold">24/2500</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-blue-200">
                    <div className="text-sm text-gray-600 mb-1">Current Streak</div>
                    <div className="text-2xl font-bold text-blue-600">7 days 🔥</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Questions List */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === 'all' ? 'All Questions' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-sm text-gray-600">{filteredQuestions.length} questions</span>
              </div>

              {filteredQuestions.map((question) => (
                <Card key={question.id} className="hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{question.category}</Badge>
                          <Badge 
                            variant="secondary"
                            className={question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                                     question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                     'bg-red-100 text-red-700'}
                          >
                            {question.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mb-2">{question.question}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-gray-600">Asked by:</span>
                          {question.companies.map((company, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm">View Answer</Button>
                      <Button size="sm" variant="outline">Practice Now</Button>
                      <Button size="sm" variant="ghost">Save</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredQuestions.length === 0 && (
                <Card className="py-12">
                  <CardContent className="text-center text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No questions found. Try adjusting your search or filters.</p>
                  </CardContent>
                </Card>
              )}

              {filteredQuestions.length > 0 && (
                <div className="text-center pt-4">
                  <Button variant="outline" size="lg">
                    Load More Questions
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsBank;
