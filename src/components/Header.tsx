import { useState, useEffect } from "react";
import { Home, Sparkles, DollarSign, Phone, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { MenuContainer } from "@/components/ui/fluid-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { HeaderActions } from "@/components/shared/HeaderActions";
import { MobileNavMenu } from "@/components/shared/MobileNavMenu";
import { FluidMenuItems } from "@/components/shared/FluidMenuItems";

const Header = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const mobileNavItems = navItems.map(item => ({
    name: item.name,
    url: item.url,
    icon: <item.icon className="w-5 h-5 text-primary" />
  }));

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
        <div className="w-full px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2 sm:gap-4">
            {/* Left Section - Logo */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-shrink-0">
              <Logo />
            </div>

            {/* Center Section - Desktop Navigation */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-4">
              <NavBar items={[
                { name: 'Home', url: '#', icon: Home },
                { name: 'Features', url: '#features', icon: Sparkles },
                { name: 'Pricing', url: '#pricing', icon: DollarSign },
                { name: 'Contact', url: '#contact', icon: Phone }
              ]} className="!fixed !top-0" />
            </div>

            {/* Right Section - Theme Toggle and Profile Dropdown */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
              <HeaderActions />
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <MobileNavMenu
                  items={mobileNavItems}
                  onItemClick={handleNavClick}
                  open={mobileMenuOpen}
                  onOpenChange={setMobileMenuOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Fluid Menu - Visible when scrolled - Desktop only */}
      {!isAtTop && (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1,
          opacity: 1,
          pointerEvents: "auto"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed top-6 right-6 z-50 hidden md:block"
      >
        <MenuContainer>
          <FluidMenuItems 
            items={navItems}
            onItemClick={handleNavClick}
            mounted={mounted}
          />
        </MenuContainer>
      </motion.div>
      )}

      {/* Mobile Floating Menu - Visible when scrolled - Mobile only */}
      {!isAtTop && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed top-6 right-6 z-50 md:hidden"
        >
          <MobileNavMenu
            items={mobileNavItems}
            onItemClick={handleNavClick}
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            trigger={
              <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            }
          />
        </motion.div>
      )}
    </>
  );
};

export default Header;
