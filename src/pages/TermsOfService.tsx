import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layouts/Footer";

const TermsOfService = () => {
  const lastUpdated = "January 1, 2024";
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Terms of Service - Jobrabbit</title>
        <meta
          name="description"
          content="Terms of Service for Jobrabbit. Read our terms and conditions for using our AI-powered resume optimization service."
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
              <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
              <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
            </div>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  By accessing or using Jobrabbit ("Service"), you agree to be bound by these
                  Terms of Service ("Terms"). If you disagree with any part of these Terms, you may
                  not access or use the Service. These Terms apply to all visitors, users, and
                  others who access or use the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Jobrabbit is an AI-powered resume optimization platform that helps users
                  improve their resumes for better compatibility with Applicant Tracking Systems
                  (ATS) and enhanced job application success. Our Service includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Resume analysis and optimization recommendations</li>
                  <li>ATS compatibility checking</li>
                  <li>Resume formatting and enhancement tools</li>
                  <li>Downloadable optimized resume files</li>
                  <li>User account management and resume storage</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Account Creation</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To use certain features of our Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your account information to keep it accurate</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Account Eligibility</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You must be at least 18 years old to create an account and use our Service. By
                  creating an account, you represent and warrant that you meet this age requirement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  4. User Content and Responsibilities
                </h2>
                <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Your Content</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You retain ownership of all content you upload to our Service, including resumes
                  and personal information. By uploading content, you grant us a limited,
                  non-exclusive, royalty-free license to use, process, and store your content solely
                  for the purpose of providing and improving our Service.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Content Restrictions</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree not to upload, post, or transmit any content that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Violates any applicable law, regulation, or third-party rights</li>
                  <li>Is false, misleading, or fraudulent</li>
                  <li>Contains viruses, malware, or other harmful code</li>
                  <li>Infringes on intellectual property rights</li>
                  <li>Is defamatory, harassing, or offensive</li>
                  <li>Contains personal information of others without their consent</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Content Accuracy</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You are solely responsible for the accuracy and truthfulness of all information
                  you provide in your resume. We are not responsible for any consequences resulting
                  from inaccurate or false information in your resume.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  5. Service Availability and Modifications
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We reserve the right to modify, suspend, or discontinue the Service (or any part
                  thereof) at any time, with or without notice. We do not guarantee that the Service
                  will be available at all times or that it will be error-free. We may perform
                  scheduled or unscheduled maintenance that may temporarily interrupt access to the
                  Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Subscription and Payment Terms</h2>
                <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Subscription Plans</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We offer various subscription plans with different features and pricing. All
                  prices are displayed in USD unless otherwise stated. Subscription fees are billed
                  in advance on a recurring basis (monthly or annually) as selected by you.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Payment Processing</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Payments are processed through third-party payment processors. By providing
                  payment information, you authorize us to charge your payment method for all fees
                  associated with your subscription.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">6.3 Refunds and Cancellations</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Due to the digital nature of Jobrabbit&apos;s services, all purchases are
                  considered final once the service has been accessed, processed, or used.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A subscription may be canceled at any time through the user&apos;s account
                  settings. Cancellation will take effect at the end of the current billing period.
                  No partial or prorated refunds will be issued for unused time within an active
                  billing cycle.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Refunds will not be provided in the following cases:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  <li>The service has been accessed or used</li>
                  <li>A resume has been uploaded or processed</li>
                  <li>An optimized resume has been generated</li>
                  <li>Any downloadable file has been accessed or downloaded</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If a billing error has occurred, users must contact support within 7 days of the
                  transaction date. Verified billing errors may be eligible for correction at our
                  sole discretion.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  By purchasing a subscription, you acknowledge and agree to this refund policy.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">6.4 Price Changes</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We reserve the right to modify subscription prices at any time. Price changes will
                  be communicated to you in advance and will apply to subsequent billing periods.
                  Continued use of the Service after a price change constitutes acceptance of the
                  new pricing.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Service and its original content, features, and functionality are owned by
                  Jobrabbit and are protected by international copyright, trademark, patent,
                  trade secret, and other intellectual property laws. You may not copy, modify,
                  distribute, sell, or lease any part of our Service without our prior written
                  consent.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  8. Disclaimers and Limitations of Liability
                </h2>
                <h3 className="text-xl font-semibold mb-3 mt-6">8.1 Service Disclaimer</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Job Application Results</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not guarantee that using our Service will result in job interviews, job
                  offers, or employment. Resume optimization is one factor in job application
                  success, and outcomes depend on numerous factors beyond our control.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">8.3 Limitation of Liability</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, Jobrabbit SHALL NOT BE LIABLE FOR
                  ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS
                  OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF
                  DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE
                  SERVICE.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree to defend, indemnify, and hold harmless Jobrabbit and its
                  officers, directors, employees, and agents from and against any claims,
                  liabilities, damages, losses, and expenses, including reasonable legal fees,
                  arising out of or in any way connected with your use of the Service, your
                  violation of these Terms, or your violation of any third-party rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may terminate or suspend your account and access to the Service immediately,
                  without prior notice or liability, for any reason, including if you breach these
                  Terms. Upon termination, your right to use the Service will cease immediately. You
                  may also terminate your account at any time by contacting us or using the account
                  deletion feature in your account settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  11. Governing Law and Dispute Resolution
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the
                  State of California, United States, without regard to its conflict of law
                  provisions. Any disputes arising from these Terms or your use of the Service shall
                  be resolved through binding arbitration in accordance with the rules of the
                  American Arbitration Association, except where prohibited by law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We reserve the right to modify these Terms at any time. We will notify you of any
                  material changes by posting the new Terms on this page and updating the "Last
                  Updated" date. Your continued use of the Service after such modifications
                  constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-muted p-6 rounded-lg">
                  <p className="text-muted-foreground mb-2">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:legal@Jobrabbit"
                      className="text-primary hover:underline"
                    >
                      legal@Jobrabbit
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Address:</strong> Jobrabbit, Legal Department
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

export default TermsOfService;
