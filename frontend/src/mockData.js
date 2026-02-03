// Mock data for frontend development

export const educationModules = [
  {
    id: 1,
    title: 'AI Models',
    icon: '🧠',
    topics: 8,
    progress: 0,
    badge: ['Premium', 'Flagship'],
    description: 'Master AI-powered interview techniques'
  },
  {
    id: 2,
    title: 'Interview Fundamentals',
    icon: '🎯',
    topics: 8,
    progress: 40,
    badge: ['Featured'],
    description: 'Core interview skills and preparation'
  },
  {
    id: 3,
    title: 'STAR Questions',
    icon: '⭐',
    topics: 9,
    progress: 60,
    description: 'Master the STAR method for behavioral questions'
  },
  {
    id: 4,
    title: 'Behavioral & Competency Excellence',
    icon: '🧠',
    topics: 8,
    progress: 30,
    description: 'Develop strong behavioral interview skills'
  },
  {
    id: 5,
    title: 'Company & Role Research Lab',
    icon: '🏢',
    topics: 8,
    progress: 20,
    description: 'Research companies and roles effectively'
  },
  {
    id: 6,
    title: 'Mock Interviews & Practice Arena',
    icon: '🎤',
    topics: 7,
    progress: 10,
    description: 'Practice with AI-powered mock interviews'
  },
  {
    id: 7,
    title: 'Internal Mobility & Promotion Toolkit',
    icon: '📈',
    topics: 6,
    progress: 50,
    description: 'Navigate internal career advancement'
  },
  {
    id: 8,
    title: 'Offer, Negotiation & Decision Skills',
    icon: '💰',
    topics: 8,
    progress: 0,
    description: 'Master salary negotiation and offer evaluation'
  },
  {
    id: 9,
    title: 'Career Readiness & Professional Branding',
    icon: '🌟',
    topics: 8,
    progress: 35,
    description: 'Build your professional brand'
  },
  {
    id: 10,
    title: 'Mindset, Confidence & Stress Management',
    icon: '🧘',
    topics: 8,
    progress: 25,
    description: 'Develop interview confidence and manage stress'
  },
  {
    id: 11,
    title: 'Job Search & Application Strategy',
    icon: '🔍',
    topics: 9,
    progress: 45,
    description: 'Optimize your job search strategy'
  },
  {
    id: 12,
    title: '1-on-1 with Xprep Experts',
    icon: '👑',
    topics: 1,
    progress: 0,
    badge: ['Premium', 'Expert Access'],
    description: 'Get personalized coaching from experts'
  }
];

export const aiTools = [
  {
    id: 1,
    title: 'AI Mock Interview',
    description: 'Practice real interview questions and get instant AI-powered feedback to improve fast.',
    icon: '🎤',
    image: '/assets/mock-interview.jpg',
    route: '/mock-interview',
    features: ['Real-time feedback', 'Multiple formats', 'Performance analytics']
  },
  {
    id: 2,
    title: 'AI Resume Builder',
    description: 'Create a professional, ATS-ready resume in minutes with AI assistance.',
    icon: '📄',
    image: '/assets/resume-builder.jpg',
    route: '/resume-builder',
    features: ['ATS optimization', 'Multiple templates', 'Real-time suggestions']
  },
  {
    id: 3,
    title: 'AI Job Hunter',
    description: 'Apply to the best jobs automatically with personalized applications.',
    icon: '🎯',
    image: '/assets/job-hunter.jpg',
    route: '/job-hunter',
    features: ['Auto-apply', 'Smart matching', 'Application tracking']
  },
  {
    id: 4,
    title: 'Interview Questions Bank',
    description: 'Access thousands of real interview questions from top companies.',
    icon: '📚',
    image: '/assets/questions-bank.jpg',
    route: '/questions-bank',
    features: ['Company-specific', 'Role-based', 'Verified answers']
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Senior Software Engineer',
    company: 'Google',
    image: '/assets/testimonial-1.jpg',
    quote: 'Xprep helped me land my dream job at Google. The AI mock interviews were incredibly realistic!',
    rating: 5
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Product Manager',
    company: 'Microsoft',
    image: '/assets/testimonial-2.jpg',
    quote: 'The AI Resume Builder transformed my CV. I got 3x more interview calls!',
    rating: 5
  },
  {
    id: 3,
    name: 'Ananya Desai',
    role: 'Data Scientist',
    company: 'Amazon',
    image: '/assets/testimonial-3.jpg',
    quote: 'Best career preparation platform I\'ve used. The feedback is spot-on and actionable.',
    rating: 5
  }
];

export const mockInterviewQuestions = [
  {
    id: 1,
    question: 'Tell me about yourself',
    category: 'Behavioral',
    difficulty: 'Easy',
    companies: ['Google', 'Amazon', 'Microsoft']
  },
  {
    id: 2,
    question: 'Describe a challenging project you worked on',
    category: 'Behavioral',
    difficulty: 'Medium',
    companies: ['Apple', 'Meta', 'Netflix']
  },
  {
    id: 3,
    question: 'How do you handle tight deadlines?',
    category: 'Behavioral',
    difficulty: 'Medium',
    companies: ['Amazon', 'Tesla', 'Google']
  }
];

export const jobListings = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Bangalore, India',
    salary: '₹30-45 LPA',
    type: 'Full-time',
    posted: '2 days ago',
    match: 95
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    salary: '₹25-40 LPA',
    type: 'Full-time',
    posted: '1 week ago',
    match: 88
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Amazon',
    location: 'Bangalore, India',
    salary: '₹28-42 LPA',
    type: 'Full-time',
    posted: '3 days ago',
    match: 92
  }
];

export const stats = {
  jobsSecured: '10K+',
  interviewsNow: '3,436',
  interviewsToday: '49,928',
  usersWorldwide: '10M+',
  trustpilotRating: '4.5',
  languages: '91'
};
