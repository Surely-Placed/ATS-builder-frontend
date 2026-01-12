import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layouts/Footer";

const CookiePolicy = () => {
  const lastUpdated = "January 1, 2024";
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Cookie Policy - Jobrabbit.AI</title>
        <meta
          name="description"
          content="Cookie Policy for Jobrabbit.AI. Learn about how we use cookies and similar technologies on our website."
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
              <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
              <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
            </div>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Cookies are small text files that are placed on your device (computer, tablet, or
                  mobile) when you visit a website. They are widely used to make websites work more
                  efficiently and provide information to website owners. Cookies allow a website to
                  recognize your device and store some information about your preferences or past
                  actions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Jobrabbit.AI uses cookies and similar tracking technologies to enhance your
                  experience on our Service. We use cookies for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To enable essential functionality of our Service</li>
                  <li>To remember your preferences and settings</li>
                  <li>To authenticate you and keep you logged in</li>
                  <li>To analyze how our Service is used and improve performance</li>
                  <li>To provide personalized content and features</li>
                  <li>To measure the effectiveness of our marketing campaigns</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Essential Cookies</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These cookies are necessary for the Service to function properly. They enable core
                  functionality such as security, network management, and accessibility. You cannot
                  opt-out of these cookies as they are essential for the Service to work.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Authentication Cookies:</strong> Keep you logged in and maintain your
                    session
                  </li>
                  <li>
                    <strong>Security Cookies:</strong> Help detect and prevent security threats
                  </li>
                  <li>
                    <strong>Load Balancing Cookies:</strong> Distribute traffic across servers
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Functional Cookies</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These cookies allow the Service to remember choices you make (such as your
                  language preference or region) and provide enhanced, personalized features.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Preference Cookies:</strong> Remember your settings and preferences
                  </li>
                  <li>
                    <strong>Language Cookies:</strong> Remember your language selection
                  </li>
                  <li>
                    <strong>Theme Cookies:</strong> Remember your theme preference (light/dark mode)
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Analytics Cookies</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These cookies help us understand how visitors interact with our Service by
                  collecting and reporting information anonymously. This helps us improve the
                  Service and user experience.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Usage Analytics:</strong> Track pages visited, time spent, and user
                    interactions
                  </li>
                  <li>
                    <strong>Performance Monitoring:</strong> Monitor Service performance and
                    identify issues
                  </li>
                  <li>
                    <strong>Error Tracking:</strong> Identify and fix technical problems
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.4 Marketing Cookies</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These cookies are used to track visitors across websites to display relevant
                  advertisements and measure the effectiveness of marketing campaigns. These cookies
                  require your consent.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Advertising Cookies:</strong> Deliver relevant advertisements
                  </li>
                  <li>
                    <strong>Conversion Tracking:</strong> Measure marketing campaign effectiveness
                  </li>
                  <li>
                    <strong>Retargeting Cookies:</strong> Show you relevant content based on your
                    interests
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In addition to our own cookies, we may also use various third-party cookies to
                  report usage statistics and deliver advertisements. These third parties may set
                  their own cookies on your device. We use the following third-party services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Google Analytics:</strong> For website analytics and performance
                    monitoring
                  </li>
                  <li>
                    <strong>Payment Processors:</strong> For secure payment processing
                  </li>
                  <li>
                    <strong>Cloud Service Providers:</strong> For hosting and infrastructure
                  </li>
                  <li>
                    <strong>Customer Support Tools:</strong> For providing customer assistance
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  These third parties may use cookies to collect information about your online
                  activities across different websites. We do not control these third-party cookies,
                  and you should review their privacy policies to understand how they use cookies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Cookie Duration</h2>
                <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Session Cookies</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Session cookies are temporary and are deleted when you close your browser. They
                  are used to maintain your session while you navigate through our Service.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Persistent Cookies</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Persistent cookies remain on your device for a set period or until you delete
                  them. They are used to remember your preferences and settings across multiple
                  visits. The duration varies depending on the type of cookie, typically ranging
                  from a few days to several years.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Managing Your Cookie Preferences</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to accept or reject cookies. Most web browsers automatically
                  accept cookies, but you can usually modify your browser settings to decline
                  cookies if you prefer. However, this may prevent you from taking full advantage of
                  our Service.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Browser Settings</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can control cookies through your browser settings. Here are links to cookie
                  management instructions for popular browsers:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <a
                      href="https://support.google.com/chrome/answer/95647"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Safari
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Microsoft Edge
                    </a>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Cookie Consent Banner</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you first visit our Service, you may see a cookie consent banner. You can
                  choose which types of cookies to accept. You can also change your preferences at
                  any time through your account settings or by clearing your browser cookies.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">6.3 Opt-Out Tools</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can opt out of certain third-party cookies using industry opt-out tools:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google Analytics Opt-Out
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://www.youronlinechoices.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Your Online Choices (EU)
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://www.networkadvertising.org/choices/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Network Advertising Initiative
                    </a>
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Impact of Disabling Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you choose to disable cookies, some features of our Service may not function
                  properly. Essential cookies are required for basic functionality, and disabling
                  them may prevent you from:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Logging into your account</li>
                  <li>Accessing secure areas of the Service</li>
                  <li>Remembering your preferences</li>
                  <li>Completing transactions</li>
                  <li>Using certain features and functionality</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Do Not Track Signals</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Some browsers include a "Do Not Track" (DNT) feature that signals to websites that
                  you do not want to be tracked. Currently, there is no standard for how websites
                  respond to DNT signals. We do not currently respond to DNT browser signals or
                  mechanisms. However, you can control tracking through your cookie preferences as
                  described above.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Updates to This Cookie Policy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our
                  practices or for other operational, legal, or regulatory reasons. We will notify
                  you of any material changes by posting the updated policy on this page and
                  updating the "Last Updated" date. We encourage you to review this Cookie Policy
                  periodically.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please
                  contact us:
                </p>
                <div className="bg-muted p-6 rounded-lg">
                  <p className="text-muted-foreground mb-2">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:privacy@jobrabbit.ai"
                      className="text-primary hover:underline"
                    >
                      privacy@jobrabbit.ai
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Address:</strong> Jobrabbit.AI, Privacy Department
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

export default CookiePolicy;
