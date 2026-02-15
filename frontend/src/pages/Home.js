import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { educationModules, testimonials, stats } from "../mockData";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Career Intelligence Platform
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get Interview Ready.
              <br />
              Career Ready.
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Master interviews with AI-powered mock sessions, build ATS-ready resumes,
              and land your dream job with intelligent career guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/MockInterview">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Button size="lg" variant="outline" className="text-lg px-8">
                Watch Demo
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.jobsSecured}
                </div>
                <div className="text-gray-600">Jobs Secured</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.interviewsNow}
                </div>
                <div className="text-gray-600">Interviews Now</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.interviewsToday}
                </div>
                <div className="text-gray-600">Interviews Today</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              AI-Powered Interview Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to ace your interviews and land your dream job
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* Mock Interview */}
            <Link to="/MockInterview" className="no-underline text-inherit">
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-2xl">AI Mock Interview</CardTitle>
                  <CardDescription className="text-base">
                    Practice real interview questions and get instant AI-powered feedback.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Resume Builder */}
            <Link to="/ResumeBuilder" className="no-underline text-inherit">
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-2xl">AI Resume Builder</CardTitle>
                  <CardDescription className="text-base">
                    Create professional, ATS-ready resumes in minutes.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Job Hunter */}
            <Link to="/JobHunter" className="no-underline text-inherit">
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-2xl">AI Job Hunter</CardTitle>
                  <CardDescription className="text-base">
                    Apply smarter with AI-powered job matching.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Questions Bank */}
            <Link to="/QuestionsBank" className="no-underline text-inherit">
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-2xl">Interview Questions Bank</CardTitle>
                  <CardDescription className="text-base">
                    Access thousands of real interview questions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Land More Offers?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Turn anxiety into confidence with AI-powered interview preparation.
          </p>

          <Link to="/MockInterview">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
