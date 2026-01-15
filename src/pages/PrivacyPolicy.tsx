import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layouts/Footer";

const PrivacyPolicy = () => {
  const lastUpdated = "January 1, 2024";
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Jobrabbit</title>
        <meta
          name="description"
          content="Privacy Policy for Jobrabbit. Learn how we collect, use, and protect your personal information."
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
              <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
            </div>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Jobrabbit ("we," "our," or "us") is committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your
                  information when you use our AI-powered resume optimization service ("Service").
                  Please read this Privacy Policy carefully. By using our Service, you agree to the
                  collection and use of information in accordance with this policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Account Information:</strong> When you create an account, we collect
                    your name, email address, and password.
                  </li>
                  <li>
                    <strong>Resume Data:</strong> We collect the resume documents you upload,
                    including personal information, work history, education, skills, and other
                    content contained in your resume.
                  </li>
                  <li>
                    <strong>Profile Information:</strong> Any additional information you choose to
                    provide in your user profile.
                  </li>
                  <li>
                    <strong>Communication Data:</strong> Information you provide when contacting our
                    support team or communicating with us.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">
                  2.2 Automatically Collected Information
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Usage Data:</strong> Information about how you access and use our
                    Service, including IP address, browser type, device information, pages visited,
                    and time spent on pages.
                  </li>
                  <li>
                    <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar
                    tracking technologies to track activity on our Service and store certain
                    information. See our Cookie Policy for more details.
                  </li>
                  <li>
                    <strong>Log Data:</strong> Server logs that may include information such as your
                    IP address, browser type, browser version, pages visited, time and date of
                    visit, and other statistics.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To provide, maintain, and improve our Service</li>
                  <li>To process and analyze your resume for optimization recommendations</li>
                  <li>To create and manage your account</li>
                  <li>
                    To communicate with you about your account, our Service, or customer support
                  </li>
                  <li>
                    To send you updates, newsletters, and promotional materials (with your consent)
                  </li>
                  <li>To detect, prevent, and address technical issues and security threats</li>
                  <li>To comply with legal obligations and enforce our Terms of Service</li>
                  <li>To analyze usage patterns and improve user experience</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We implement appropriate technical and organizational security measures to protect
                  your personal information against unauthorized access, alteration, disclosure, or
                  destruction. However, no method of transmission over the Internet or electronic
                  storage is 100% secure. While we strive to use commercially acceptable means to
                  protect your information, we cannot guarantee absolute security.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Your resume data is stored securely on our servers and is encrypted both in
                  transit and at rest. We retain your information for as long as necessary to
                  provide our Service and comply with legal obligations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  5. Information Sharing and Disclosure
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may
                  share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Service Providers:</strong> We may share information with third-party
                    service providers who perform services on our behalf, such as cloud hosting,
                    analytics, and customer support. These providers are contractually obligated to
                    protect your information.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose information if required by
                    law, court order, or government regulation, or to protect our rights, property,
                    or safety, or that of our users.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a merger, acquisition, or
                    sale of assets, your information may be transferred as part of that transaction.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> We may share your information with your
                    explicit consent for any other purpose.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal
                  information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Access:</strong> You can request access to the personal information we
                    hold about you.
                  </li>
                  <li>
                    <strong>Correction:</strong> You can update or correct your personal information
                    through your account settings.
                  </li>
                  <li>
                    <strong>Deletion:</strong> You can request deletion of your account and
                    associated data by contacting us.
                  </li>
                  <li>
                    <strong>Data Portability:</strong> You can request a copy of your data in a
                    structured, machine-readable format.
                  </li>
                  <li>
                    <strong>Opt-Out:</strong> You can opt-out of marketing communications by using
                    the unsubscribe link in our emails or contacting us.
                  </li>
                  <li>
                    <strong>Cookie Preferences:</strong> You can manage cookie preferences through
                    your browser settings.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, please contact us at{" "}
                  <a
                    href="mailto:privacy@Jobrabbit"
                    className="text-primary hover:underline"
                  >
                    privacy@Jobrabbit
                  </a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our Service is not intended for individuals under the age of 18. We do not
                  knowingly collect personal information from children under 18. If you become aware
                  that a child has provided us with personal information, please contact us, and we
                  will take steps to delete such information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Your information may be transferred to and processed in countries other than your
                  country of residence. These countries may have data protection laws that differ
                  from those in your country. By using our Service, you consent to the transfer of
                  your information to these countries.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the "Last
                  Updated" date. You are advised to review this Privacy Policy periodically for any
                  changes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-muted p-6 rounded-lg">
                  <p className="text-muted-foreground mb-2">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:privacy@Jobrabbit"
                      className="text-primary hover:underline"
                    >
                      privacy@Jobrabbit
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Address:</strong> Jobrabbit, Privacy Department
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

export default PrivacyPolicy;
