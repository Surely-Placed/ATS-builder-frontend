import { FileText } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Contact" },
  ];

  return (
    <footer className="py-12 border-t border-glass-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <a href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold">
                Resume<span className="text-primary">AI</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              AI-powered resume optimization for ATS compatibility. Land more interviews, faster.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 pt-8 border-t border-glass-border text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ResumeAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
