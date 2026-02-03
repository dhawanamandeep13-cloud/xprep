import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { educationModules } from '../mockData';
import { Play, Lock } from 'lucide-react';

const Modules = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Career Preparation Modules</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive learning paths designed to prepare you for every stage of your career journey
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {educationModules.map((module) => (
              <Card key={module.id} className="hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{module.icon}</span>
                    {module.badge && (
                      <div className="flex gap-1 flex-wrap">
                        {module.badge.includes('Premium') && (
                          <Badge variant="secondary" className="text-xs">👑 Premium</Badge>
                        )}
                        {module.badge.includes('Flagship') && (
                          <Badge variant="secondary" className="text-xs">⭐</Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{module.topics} Topics</span>
                      <span className="font-medium text-blue-600">{module.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      variant={module.progress > 0 ? "default" : "outline"}
                    >
                      {module.progress > 0 ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Start Module
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modules;
