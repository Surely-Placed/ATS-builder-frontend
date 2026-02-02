# 🚀 Jobrabbit.AI - AI-Powered ATS Resume Builder & Optimizer

An intelligent web application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS) using AI-powered analysis and optimization. Upload your resume, get instant feedback, and download an optimized, ATS-friendly PDF version.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)

## ✨ Features

### 🔍 Resume Analysis

- **ATS Score Calculation**: Get real-time ATS compatibility scores before and after optimization
- **Section-by-Section Analysis**: Detailed feedback on each resume section (skills, experience, summary, etc.)
- **Keyword Alignment**: Identify missing or misaligned keywords for target job descriptions
- **Quality Metrics**: Comprehensive scoring for content quality, structure, and formatting

### 🤖 AI-Powered Optimization

- **Automatic Improvements**: AI suggests and implements improvements to boost ATS scores
- **Real-time Processing**: WebSocket-based real-time optimization status updates
- **Smart Recommendations**: Get actionable suggestions for enhancing your resume
- **Content Enhancement**: Improve bullet points, summaries, and skill descriptions

### 📄 Resume Preview & Download

- **Side-by-Side Comparison**: Compare original and optimized resumes with highlighted changes
- **Change Tracking**: See exactly what changed with color-coded modifications
- **PDF Generation**: Download professionally formatted PDF resumes
- **Export Options**: Multiple export formats for different application systems

### 👤 User Management

- **Firebase Authentication**: Secure user registration and login
- **Dashboard**: Track your resume optimization history and statistics
- **Document Management**: Organize and manage multiple resume versions
- **Email Verification**: Secure email verification process

### 🎨 Modern UI/UX

- **Dark Mode Support**: Beautiful dark and light themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Engaging animations and transitions
- **Accessible Components**: Built with accessibility in mind using Radix UI

## 🛠️ Tech Stack

### Frontend

- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool and dev server
- **React Router 6.30.2** - Routing
- **Tailwind CSS 3.4.17** - Styling
- **shadcn/ui** - Component library (Radix UI + Tailwind)
- **Framer Motion 12.23.26** - Animations

### State Management & Data Fetching

- **TanStack Query 5.83.0** - Server state management
- **React Hook Form 7.61.1** - Form handling
- **Zod 3.25.76** - Schema validation

### Backend Integration

- **Axios 1.13.2** - HTTP client
- **Socket.IO Client 4.8.3** - Real-time WebSocket communication

### Authentication

- **Firebase 12.7.0** - Authentication and user management

### Additional Libraries

- **React Helmet Async 2.0.5** - SEO and meta tags
- **Next Themes 0.3.0** - Theme management
- **Canvas Confetti 1.9.4** - Celebration effects
- **Recharts 2.15.4** - Data visualization
- **Date-fns 3.6.0** - Date utilities

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd ai-resume-genius
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Firebase Configuration (if using Firebase)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 📜 Available Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start development server with hot-reload |
| `npm run build`     | Build production bundle                  |
| `npm run build:dev` | Build development bundle                 |
| `npm run preview`   | Preview production build locally         |
| `npm run lint`      | Run ESLint to check code quality         |

## 📁 Project Structure

```
ai-resume-genius/
├── public/                 # Static assets
├── src/
│   ├── components/         # Shared React components
│   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   └── layouts/        # Layout components
│   ├── config/             # Configuration files
│   │   ├── api.ts          # API configuration
│   │   └── firebase.ts     # Firebase configuration
│   ├── context/            # React context providers
│   │   └── AuthContext.tsx # Authentication context
│   ├── features/           # Feature-based modules
│   │   ├── analysis/       # Analysis & Optimization logic
│   │   │   ├── components/ # Feature-specific components
│   │   │   ├── hooks/      # Feature-specific hooks
│   │   │   └── services/   # Feature-specific API services
│   │   ├── dashboard/      # Dashboard feature
│   │   ├── profile/        # User profile management
│   │   ├── resume/         # Resume management (upload, list)
│   │   └── subscription/   # Subscription management
│   ├── hooks/              # Shared custom React hooks
│   ├── pages/              # Top-level page components
│   ├── services/           # Shared services
│   │   └── authService.ts  # Authentication service
│   ├── types/              # Shared TypeScript definitions
│   ├── utils/              # Shared utility functions
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── tailwind.config.ts      # Tailwind CSS configuration
```

## 🔌 API Integration

The application communicates with a backend API for resume analysis and optimization. Key API endpoints include:

### Resume Analysis

- `POST /api/analyze` - Submit resume for analysis
- `GET /api/analyze/:analysisId` - Get analysis results
- `GET /api/analyze/:analysisId/preview` - Get preview of changes
- `POST /api/analyze/:analysisId/generate-pdf` - Generate optimized PDF

### Resume Management

- `GET /api/resumes` - Get user's resumes
- `GET /api/resumes/:id` - Get specific resume
- `DELETE /api/resumes/:id` - Delete resume

### Authentication

- Uses Firebase Authentication with JWT tokens
- Tokens are stored in localStorage and sent in Authorization headers

## 🎯 Key Features Implementation

### Resume Analysis Flow

1. **Upload**: User uploads resume file (PDF/DOCX)
2. **Analysis**: Backend analyzes resume for ATS compatibility
3. **Feedback**: Frontend displays detailed analysis with scores
4. **Optimization**: User can request AI-powered optimization
5. **Preview**: User reviews changes before finalizing
6. **Download**: User downloads optimized PDF

### Real-time Updates

- Uses Socket.IO for real-time optimization status updates
- Progress indicators show optimization progress
- Toast notifications for status changes

### Score Display System

- Centralized score utility (`scoreUtils.ts`) handles score mapping
- Displays user-friendly score ranges (50-60 before, 80-90 after)
- Shows improvement metrics and color-coded feedback

## 🎨 UI Components

The project uses **shadcn/ui** components built on Radix UI primitives:

- Fully accessible components
- Customizable with Tailwind CSS
- Dark mode support built-in
- TypeScript support

Key components:

- Cards, Buttons, Forms, Dialogs, Toasts
- Navigation menus, Dropdowns, Modals
- Charts, Tables, Progress indicators

## 🔒 Authentication Flow

1. User registers/logs in via Firebase
2. Firebase ID token is stored in localStorage
3. Token is sent with API requests via Authorization header
4. Protected routes check authentication status
5. Email verification required for full access

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:

- `VITE_API_URL` - Backend API URL
- Firebase configuration variables (if using Firebase)

### Recommended Hosting Platforms

- **Vercel** - Recommended for Vite/React apps
- **Netlify** - Easy deployment with CI/CD
- **AWS Amplify** - Full-stack deployment
- **GitHub Pages** - Free static hosting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules (run `npm run lint`)
- Use Prettier for code formatting (if configured)
- Write meaningful commit messages

## 🐛 Troubleshooting

### Common Issues

**Port already in use**

```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3000
```

**Environment variables not loading**

- Ensure `.env` file is in root directory
- Restart dev server after adding new variables
- Variables must start with `VITE_` to be exposed to client

**Build errors**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**

```bash
# Regenerate types
npm run build
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Radix UI** - Accessible component primitives
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Authentication service

## 📞 Support

For support, email support@Jobrabbit.AI.com or open an issue in the repository.

## 🔮 Roadmap

- [ ] Multi-language support
- [ ] Resume templates library
- [ ] Cover letter generator
- [ ] Interview preparation tools
- [ ] Integration with job boards
- [ ] Advanced analytics dashboard
- [ ] Team/enterprise features

---

Made with ❤️ using React, TypeScript, and modern web technologies.
