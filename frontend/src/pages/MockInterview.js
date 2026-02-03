import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Mic, MicOff, SkipForward, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import APIService from '../services/api';

const MockInterview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [interviewType, setInterviewType] = useState('behavioral');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const handleStartInterview = async () => {
    setIsLoading(true);
    try {
      const data = await APIService.startMockInterview(interviewType);
      setSessionId(data.session_id);
      setCurrentQuestion(data.question);
      setFeedback(null);
      setAnswer('');
      setQuestionsAnswered(0);
      toast({
        title: "Interview Started!",
        description: "Answer the question to get AI-powered feedback.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start interview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(!isRecording);
    // Mock: In real implementation, this would use Web Speech API
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "Empty Answer",
        description: "Please provide an answer before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await APIService.submitAnswer(sessionId, currentQuestion.id, answer);
      setFeedback(data.feedback);
      setQuestionsAnswered(prev => prev + 1);
      
      if (data.next_question) {
        setCurrentQuestion(data.next_question);
        setAnswer('');
      }
      
      toast({
        title: "Feedback Received!",
        description: `Score: ${data.feedback.score}/100`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    setAnswer('');
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AI Mock Interview</h1>
            <p className="text-xl text-gray-600">
              Practice with AI-powered feedback and improve your interview skills
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Interview Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Interview Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Interview Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Select value={interviewType} onValueChange={setInterviewType}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                        <SelectItem value="technical">Technical Interview</SelectItem>
                        <SelectItem value="case">Case Interview</SelectItem>
                        <SelectItem value="general">General Interview</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleNextQuestion}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Current Question */}
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge>{question.category}</Badge>
                    <Badge variant="secondary">{question.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-2xl">{question.question}</CardTitle>
                  <CardDescription>
                    Question {currentQuestion + 1} of {mockInterviewQuestions.length}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your answer here or use voice recording..."
                      rows={8}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant={isRecording ? 'destructive' : 'outline'}
                        onClick={handleStartRecording}
                        className="flex-1"
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="w-4 h-4 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Start Recording
                          </>
                        )}
                      </Button>
                      <Button onClick={handleSubmitAnswer} disabled={!answer} className="flex-1">
                        Get AI Feedback
                      </Button>
                      <Button variant="outline" onClick={handleNextQuestion}>
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback */}
              {feedback && (
                <Card className="border-2 border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      AI Feedback
                      <Badge className="text-lg px-4 py-1" variant="secondary">
                        Score: {feedback.score}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-700">Strengths</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {feedback.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-orange-700">Areas for Improvement</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {feedback.improvements.map((improvement, idx) => (
                          <li key={idx} className="text-sm">{improvement}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-700">AI Suggestion</h4>
                      <p className="text-sm">{feedback.suggestion}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Questions Answered</span>
                        <span className="font-semibold">0/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Score</span>
                        <span className="font-semibold text-green-600">-</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Interview Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Use the STAR method for behavioral questions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Be specific with examples and metrics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Practice out loud for better fluency</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Focus on impact and results</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Common Companies */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Asked By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {question.companies.map((company, idx) => (
                      <Badge key={idx} variant="outline">{company}</Badge>
                    ))}
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

export default MockInterview;
