import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/layouts/Header";
import { HeroSection } from "@/components/ui/hero-section-dark";
import BrandsSection from "@/components/sections/BrandsSection";
import StatsSection from "@/components/sections/StatsSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import { CTASection } from "@/components/sections/cta";
import Footer from "@/components/layouts/Footer";
import { HowItWorks } from "@/components/ui/how-it-works";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import { LoginModal } from "@/components/ui/login-modal";

const Index = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login") {
      setLoginOpen(true);
    }
  }, [location]);

  const handleLoginClose = (open: boolean) => {
    setLoginOpen(open);
    if (!open) navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>Jobrabbit - AI-Powered ATS Resume Builder & Optimizer</title>
        <meta
          name="description"
          content="Upload your resume, let AI fix ATS compatibility issues, and download a perfectly optimized PDF. No manual editing required. Get more interviews with Jobrabbit."
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
      />
    </>
  );
};

export default Index;
