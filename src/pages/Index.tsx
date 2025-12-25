import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
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
          <HeroSection />
          <TrustSection />
          <FeaturesSection />
          <HowItWorksSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
