import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layouts/Footer";

const Disclaimer = () => {
  const lastUpdated = "January 1, 2024";
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Disclaimer - Jobrabbit.AI</title>
        <meta
          name="description"
          content="Disclaimer for Jobrabbit.AI. Important information about the limitations and use of our AI-powered resume optimization service."
        />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Back Button */}
            <Button variant="ghost" className="mb-8" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Disclaimer</h1>
              <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
            </div>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. General Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The information contained on Jobrabbit.AI ("Service") is for general
                  information purposes only. While we strive to provide accurate and up-to-date
                  information, we make no representations or warranties of any kind, express or
                  implied, about the completeness, accuracy, reliability, suitability, or
                  availability of the Service or the information, products, services, or related
                  graphics contained on the Service for any purpose.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. No Guarantee of Results</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Jobrabbit.AI provides AI-powered resume optimization tools and
                  recommendations. However, we do not guarantee, warrant, or represent that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    Using our Service will result in job interviews, job offers, or employment
                  </li>
                  <li>Your resume will pass all Applicant Tracking Systems (ATS)</li>
                  <li>Your resume will be selected by employers or recruiters</li>
                  <li>You will receive any specific number of responses to job applications</li>
                  <li>Our optimization recommendations will improve your job search outcomes</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Job application success depends on numerous factors beyond our control, including
                  but not limited to: job market conditions, industry requirements, employer
                  preferences, your qualifications and experience, interview performance, and
                  competition from other candidates.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. AI Technology Limitations</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our Service uses artificial intelligence and machine learning technologies to
                  analyze and optimize resumes. You acknowledge and understand that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>AI technology is not perfect and may produce errors or inaccuracies</li>
                  <li>
                    AI recommendations are based on algorithms and patterns, not human judgment
                  </li>
                  <li>
                    Our AI models may not account for all industry-specific requirements or nuances
                  </li>
                  <li>
                    AI analysis is a tool to assist you, not a replacement for professional career
                    advice
                  </li>
                  <li>
                    You are responsible for reviewing and approving all AI-generated suggestions
                  </li>
                  <li>You should verify the accuracy and appropriateness of all recommendations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  4. Content Accuracy and Responsibility
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You are solely responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    The accuracy, truthfulness, and completeness of all information in your resume
                  </li>
                  <li>
                    Ensuring that your resume does not contain false, misleading, or fraudulent
                    information
                  </li>
                  <li>
                    Verifying that all claims, qualifications, and experiences in your resume are
                    accurate
                  </li>
                  <li>
                    Complying with all applicable laws and regulations regarding resume content
                  </li>
                  <li>
                    Any consequences resulting from inaccurate, false, or misleading information in
                    your resume
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We are not responsible for any misrepresentations, inaccuracies, or false
                  information in your resume, even if such information was suggested or formatted by
                  our Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Professional Advice</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The information and recommendations provided by our Service are not intended to
                  constitute professional career counseling, legal advice, or employment consulting.
                  Our Service is a tool to assist with resume formatting and optimization, not a
                  substitute for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Professional career counseling or coaching</li>
                  <li>Legal advice regarding employment matters</li>
                  <li>Professional resume writing services</li>
                  <li>Industry-specific career guidance</li>
                  <li>Personalized career advice tailored to your specific situation</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We recommend consulting with qualified professionals for personalized career
                  advice, legal guidance, or specialized resume writing services when appropriate.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services and Links</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our Service may contain links to third-party websites, services, or resources. We
                  do not endorse, control, or assume responsibility for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>The content, privacy policies, or practices of third-party websites</li>
                  <li>The accuracy or reliability of information on third-party websites</li>
                  <li>The availability or functionality of third-party services</li>
                  <li>Any transactions or interactions between you and third parties</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You acknowledge and agree that we shall not be responsible or liable for any loss
                  or damage of any sort incurred as a result of your use of any third-party services
                  or resources.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Service Availability and Errors</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We strive to provide a reliable and uninterrupted Service, but we do not guarantee
                  that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>The Service will be available at all times or free from interruptions</li>
                  <li>The Service will be error-free or free from bugs</li>
                  <li>All features will function as intended at all times</li>
                  <li>Data will not be lost or corrupted</li>
                  <li>The Service will be compatible with all devices or browsers</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We reserve the right to modify, suspend, or discontinue any part of the Service at
                  any time without notice. We are not liable for any loss or damage resulting from
                  Service unavailability, errors, or interruptions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To the maximum extent permitted by applicable law, Jobrabbit.AI, its officers,
                  directors, employees, agents, and affiliates shall not be liable for any direct,
                  indirect, incidental, special, consequential, or punitive damages, including but
                  not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Loss of employment opportunities or job offers</li>
                  <li>Loss of income or earnings</li>
                  <li>Loss of data or information</li>
                  <li>Business interruption or loss of business opportunities</li>
                  <li>Reputation damage or professional consequences</li>
                  <li>Any other damages arising from your use or inability to use the Service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. No Endorsement</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Reference to any specific company, product, process, or service by trade name,
                  trademark, manufacturer, or otherwise does not constitute or imply endorsement,
                  recommendation, or favoring by Jobrabbit.AI. Any such references are for
                  informational purposes only.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Changes to Service</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We reserve the right to modify, update, or discontinue any aspect of the Service
                  at any time, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Features and functionality</li>
                  <li>Pricing and subscription plans</li>
                  <li>User interface and design</li>
                  <li>Algorithms and AI models</li>
                  <li>Terms of service and policies</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We are not obligated to provide notice of such changes, and you acknowledge that
                  we shall not be liable to you or any third party for any modification, suspension,
                  or discontinuance of the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">11. Use at Your Own Risk</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Your use of the Service is at your sole risk. The Service is provided on an "AS
                  IS" and "AS AVAILABLE" basis. You acknowledge that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You use the Service at your own discretion and risk</li>
                  <li>You are responsible for evaluating the suitability of our recommendations</li>
                  <li>You should seek professional advice when appropriate</li>
                  <li>You should verify all information before submitting job applications</li>
                  <li>You are responsible for backing up your data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions about this Disclaimer, please contact us:
                </p>
                <div className="bg-muted p-6 rounded-lg">
                  <p className="text-muted-foreground mb-2">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:support@jobrabbit.ai"
                      className="text-primary hover:underline"
                    >
                      support@jobrabbit.ai
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Address:</strong> Jobrabbit.AI, Support Department
                    <br />
                    Gandhinagar, Gujarat, India
                    <br />
                    Salt Lake City, Utah, USA
                    <br />
                    IFZA Business Park, Dubai, UAE
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Disclaimer;
