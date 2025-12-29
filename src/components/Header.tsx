import { useState, useEffect } from "react";
import { FileText, Home, Sparkles, DollarSign, Phone, Menu, X, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { MenuItem, MenuContainer } from "@/components/ui/fluid-menu";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'Features', url: '#features', icon: Sparkles },
    { name: 'Pricing', url: '#pricing', icon: DollarSign },
    { name: 'Contact', url: '#contact', icon: Phone }
  ];

  const handleNavClick = (url: string) => {
    setMobileMenuOpen(false);
    window.location.href = url;
  };

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Top Header - Visible only at top */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ 
          y: isAtTop ? 0 : -20,
          opacity: isAtTop ? 1 : 0,
          pointerEvents: isAtTop ? "auto" : "none"
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 z-50 bg-transparent"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="relative p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                <FileText className="w-5 h-5 text-primary" />
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Resume<span className="text-primary">AI</span>
              </span>
            </a>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:block">
              <NavBar items={navItems} className="!fixed !top-0" />
            </div>

            {/* Mobile Menu Button - Visible on mobile */}
            <div className="flex items-center gap-3 md:hidden">
              {mounted && <ThemeToggle />}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.name}
                          href={item.url}
                          onClick={() => handleNavClick(item.url)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="text-base font-medium">{item.name}</span>
                        </a>
                      );
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* Right Section - Desktop only */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Fluid Menu - Visible when scrolled - Desktop only */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isAtTop ? 0 : 1,
          opacity: isAtTop ? 0 : 1,
          pointerEvents: isAtTop ? "none" : "auto"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed top-6 right-6 z-50 hidden md:block"
      >
        <MenuContainer>
          <MenuItem 
            icon={
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-100 scale-100 rotate-0 [div[data-expanded=true]_&]:opacity-0 [div[data-expanded=true]_&]:scale-0 [div[data-expanded=true]_&]:rotate-180">
                  <Menu size={20} strokeWidth={2} className="text-primary-foreground" />
                </div>
                <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-0 scale-0 -rotate-180 [div[data-expanded=true]_&]:opacity-100 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:rotate-0">
                  <X size={20} strokeWidth={2} className="text-primary-foreground" />
                </div>
              </div>
            } 
          />
          <MenuItem 
            icon={
              <div className="group/item relative">
                <Home size={20} strokeWidth={2} className="text-foreground" />
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none">
                  Home
                </div>
              </div>
            }
            onClick={() => handleNavClick('#')}
          />
          <MenuItem 
            icon={
              <div className="group/item relative">
                <Sparkles size={20} strokeWidth={2} className="text-foreground" />
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none">
                  Features
                </div>
              </div>
            }
            onClick={() => handleNavClick('#features')}
          />
          <MenuItem 
            icon={
              <div className="group/item relative">
                <DollarSign size={20} strokeWidth={2} className="text-foreground" />
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none">
                  Pricing
                </div>
              </div>
            }
            onClick={() => handleNavClick('#pricing')}
          />
          <MenuItem 
            icon={
              <div className="group/item relative">
                <Phone size={20} strokeWidth={2} className="text-foreground" />
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none">
                  Contact
                </div>
              </div>
            }
            onClick={() => handleNavClick('#contact')}
          />
          {mounted && (
            <MenuItem 
              icon={
                <div className="group/item relative">
                  {resolvedTheme === "dark" 
                    ? <Sun size={20} strokeWidth={2} className="text-foreground" />
                    : <Moon size={20} strokeWidth={2} className="text-foreground" />
                  }
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none">
                    Theme
                  </div>
                </div>
              }
              onClick={handleThemeToggle}
            />
          )}
        </MenuContainer>
      </motion.div>

      {/* Mobile Floating Menu - Visible when scrolled - Mobile only */}
      {!isAtTop && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed top-6 right-6 z-50 md:hidden"
        >
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      onClick={() => handleNavClick(item.url)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-base font-medium">{item.name}</span>
                    </a>
                  );
                })}
                <div className="border-t pt-4 mt-2">
                  <button
                    onClick={handleThemeToggle}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors w-full"
                  >
                    {resolvedTheme === "dark" 
                      ? <Sun className="w-5 h-5 text-primary" />
                      : <Moon className="w-5 h-5 text-primary" />
                    }
                    <span className="text-base font-medium">
                      {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                    </span>
                  </button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </motion.div>
      )}
    </>
  );
};

export default Header;
