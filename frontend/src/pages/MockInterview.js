import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../components/ui/select';
import { Mic, MicOff, SkipForward, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import APIService from '../services/api';

const ROLE_GROUPS = [
  {
    label: 'Business & finance',
    roles: ['Accountant', 'Business Analyst', 'Business Development Manager', 'Consultant', 'Data Analyst', 'Financial Analyst', 'Investment Banker', 'Marketing Manager', 'Operations Manager', 'Product Manager', 'Project Manager', 'Sales Manager'],
  },
  {
    label: 'Technology',
    roles: ['AI / Machine Learning Engineer', 'Cloud Engineer', 'Cybersecurity Analyst', 'Data Engineer', 'Data Scientist', 'DevOps Engineer', 'Frontend Developer', 'Full Stack Developer', 'IT Support Specialist', 'Mobile Developer', 'Product Designer (UX/UI)', 'QA Engineer', 'Software Engineer', 'Solutions Architect'],
  },
  {
    label: 'People, legal & education',
    roles: ['Attorney / Legal Counsel', 'Customer Success Manager', 'HR Manager', 'Recruiter', 'Teacher / Lecturer', 'Training and Development Specialist'],
  },
  {
    label: 'Healthcare & science',
    roles: ['Clinical Research Associate', 'Doctor', 'Laboratory Technician', 'Nurse', 'Pharmacist', 'Research Scientist'],
  },
  {
    label: 'Engineering & skilled professions',
    roles: ['Architect', 'Civil Engineer', 'Electrical Engineer', 'Mechanical Engineer', 'Supply Chain Manager', 'UX Researcher'],
  },
];

const CUSTOM_ROLE_VALUE = 'custom';

const MockInterview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [interviewType, setInterviewType] = useState('behavioral');
  const [targetRole, setTargetRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('mid');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [nextQuestion, setNextQuestion] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const recognitionRef = useRef(null);
  const answerAtRecordingStartRef = useRef('');

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const handleStartInterview = async () => {
    const role = targetRole === CUSTOM_ROLE_VALUE ? customRole.trim() : targetRole;
    if (!role) {
      toast({
        title: 'Choose a target role',
        description: 'Select a role from the list or choose Custom / Any Other Role and enter it.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await APIService.startMockInterview(interviewType, role, experienceLevel);
      setSessionId(data.session_id);
      setCurrentQuestion(data.question);
      setFeedback(null);
      setAnswer('');
      setQuestionsAnswered(0);
      setNextQuestion(null);
      setTotalQuestions(data.total_questions || 0);
      setIsComplete(false);
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
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: 'Speech recognition is unavailable',
        description: 'Use the latest Chrome or Edge browser, allow microphone access, or type your answer instead.',
        variant: 'destructive',
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    answerAtRecordingStartRef.current = answer.trim() ? `${answer.trim()} ` : '';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let index = 0; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript;
        if (event.results[index].isFinal) finalTranscript += transcript;
        else interimTranscript += transcript;
      }
      setAnswer(`${answerAtRecordingStartRef.current}${finalTranscript}${interimTranscript}`.trim());
    };
    recognition.onerror = (event) => {
      const message = event.error === 'not-allowed' || event.error === 'service-not-allowed'
        ? 'Microphone access was blocked. Allow microphone permission in your browser and try again.'
        : `Speech recognition stopped: ${event.error}. Please try again or type your answer.`;
      toast({ title: 'Voice input unavailable', description: message, variant: 'destructive' });
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsRecording(true);
      toast({ title: 'Listening…', description: 'Speak clearly. Your words will appear in the answer box.' });
    } catch (error) {
      setIsRecording(false);
      toast({ title: 'Could not start voice input', description: 'Please try again after allowing microphone access.', variant: 'destructive' });
    }
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

    recognitionRef.current?.stop();
    setIsLoading(true);
    try {
      const data = await APIService.submitAnswer(sessionId, currentQuestion.id, answer);
      setFeedback(data.feedback);
      setQuestionsAnswered(data.answered_count ?? (questionsAnswered + 1));
      setNextQuestion(data.next_question || null);
      setIsComplete(Boolean(data.completed));
      
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
    if (nextQuestion) setCurrentQuestion(nextQuestion);
    setAnswer('');
    setFeedback(null);
    setNextQuestion(null);
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
              {!sessionId && (
                <Card>
                  <CardHeader>
                    <CardTitle>Start Your Practice Interview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
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
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="target-role" className="mb-1 block text-sm font-medium text-gray-700">Target role</label>
                          <Select value={targetRole} onValueChange={setTargetRole}>
                            <SelectTrigger id="target-role" className="w-full"><SelectValue placeholder="Choose your target role" /></SelectTrigger>
                            <SelectContent>
                              {ROLE_GROUPS.map((group) => (
                                <SelectGroup key={group.label}>
                                  <SelectLabel>{group.label}</SelectLabel>
                                  {group.roles.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                                </SelectGroup>
                              ))}
                              <SelectGroup>
                                <SelectLabel>Other</SelectLabel>
                                <SelectItem value={CUSTOM_ROLE_VALUE}>Custom / Any Other Role</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        {targetRole === CUSTOM_ROLE_VALUE && (
                          <div>
                            <label htmlFor="custom-target-role" className="mb-1 block text-sm font-medium text-gray-700">Enter your target role</label>
                            <input id="custom-target-role" value={customRole} onChange={(event) => setCustomRole(event.target.value)} placeholder="e.g. Sustainability Consultant" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" autoFocus />
                          </div>
                        )}
                      </div>
                      <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Experience level" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Fresher / Entry level</SelectItem>
                          <SelectItem value="mid">Mid level</SelectItem>
                          <SelectItem value="senior">Senior level</SelectItem>
                          <SelectItem value="lead">Manager / Leadership</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleStartInterview} className="w-full" size="lg" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          'Start Interview'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Current Question */}
              {currentQuestion && (
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge>{currentQuestion.category}</Badge>
                      <Badge variant="secondary">{currentQuestion.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-2xl">{currentQuestion.text}</CardTitle>
                    <CardDescription>
                      Question {questionsAnswered + 1}
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
                        disabled={isLoading || Boolean(feedback) || isComplete}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant={isRecording ? 'destructive' : 'outline'}
                          onClick={handleStartRecording}
                          className="flex-1"
                          disabled={isLoading || Boolean(feedback) || isComplete}
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
                        <Button onClick={handleSubmitAnswer} disabled={!answer || isLoading || Boolean(feedback) || isComplete} className="flex-1">
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Getting Feedback...
                            </>
                          ) : (
                            'Get AI Feedback'
                          )}
                        </Button>
                        <Button variant="outline" onClick={handleNextQuestion} disabled={isLoading || !nextQuestion} title={nextQuestion ? 'Continue to the next question' : 'Submit your answer to unlock the next question'}>
                          <SkipForward className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">Voice input uses your browser’s speech recognition. Allow microphone access when prompted; Chrome and Edge provide the best support.</p>
                    </div>
                  </CardContent>
                </Card>
              )}

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
              {isComplete && (
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardContent className="py-5 text-center"><p className="font-semibold text-blue-900">Interview complete</p><p className="mt-1 text-sm text-blue-800">You answered {questionsAnswered} question{questionsAnswered === 1 ? '' : 's'}. Start a new session to practise again.</p></CardContent>
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
                        <span className="font-semibold">{questionsAnswered}{totalQuestions ? ` / ${totalQuestions}` : ''}</span>
                      </div>
                    </div>
                    {sessionId && (
                      <Button variant="outline" size="sm" className="w-full" onClick={handleStartInterview}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Start New Session
                      </Button>
                    )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
