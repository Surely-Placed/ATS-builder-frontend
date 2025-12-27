import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { HeroSection } from "@/components/ui/hero-section-dark";
import BrandsSection from "@/components/BrandsSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { HowItWorks } from "@/components/ui/how-it-works";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import { LoginModal } from "@/components/ui/login-modal";
import { SignupModal } from "@/components/ui/signup-modal";
import { ForgotPasswordModal } from "@/components/ui/forgot-password-modal";

const Index = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login') {
      setLoginOpen(true);
    } else if (location.pathname === '/signup') {
      setSignupOpen(true);
    }
  }, [location]);

  const handleLoginClose = (open: boolean) => {
    setLoginOpen(open);
    if (!open) navigate('/');
  };

  const handleSignupClose = (open: boolean) => {
    setSignupOpen(open);
    if (!open) navigate('/');
  };

  const switchToSignup = () => {
    setLoginOpen(false);
    setSignupOpen(true);
    navigate('/signup');
  };

  const switchToLogin = () => {
    setSignupOpen(false);
    setForgotPasswordOpen(false);
    setLoginOpen(true);
    navigate('/login');
  };

  const switchToForgotPassword = () => {
    setLoginOpen(false);
    setForgotPasswordOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>ResumeAI - AI-Powered ATS Resume Builder & Optimizer</title>
        <meta
          name="description"
          content="Upload your resume, let AI fix ATS compatibility issues, and download a perfectly optimized PDF. No manual editing required. Get more interviews with ResumeAI."
        />
        <meta
          name="keywords"
          content="ATS resume, resume builder, AI resume optimizer, ATS friendly resume, resume checker"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection 
            title="AI-Powered Resume Builder"
            subtitle={{
              regular: "Transform your resume with ",
              gradient: "AI-powered ATS optimization",
            }}
            description="Upload your resume and let our AI fix compatibility issues, optimize for ATS systems, and boost your interview chances. Get a perfectly formatted PDF in seconds."
            ctaText="Start Optimizing"
            ctaHref="#"
            bottomImage={{
              light: "",
              dark: "",
            }}
            gridOptions={{
              angle: 65,
            }}
          />
          <FeaturesSection />
          <HowItWorks />
          <BrandsSection />
          <PricingSection />
          <TestimonialsSection />
          <StatsSection />
          <CTASection />
        </main>
        <Footer />
      </div>

      <LoginModal 
        open={loginOpen} 
        onOpenChange={handleLoginClose}
        onSwitchToSignup={switchToSignup}
        onSwitchToForgotPassword={switchToForgotPassword}
      />
      <SignupModal 
        open={signupOpen} 
        onOpenChange={handleSignupClose}
        onSwitchToLogin={switchToLogin}
      />
      <ForgotPasswordModal 
        open={forgotPasswordOpen} 
        onOpenChange={setForgotPasswordOpen}
        onBackToLogin={switchToLogin}
      />
    </>
  );
};

export default Index;