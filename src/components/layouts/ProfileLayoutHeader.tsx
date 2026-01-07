import { Logo } from "@/components/shared/Logo";
import { HeaderActions } from "@/components/shared/HeaderActions";

interface ProfileHeaderProps {
  profileNavigation?: React.ReactNode;
}

const ProfileHeader = ({ profileNavigation }: ProfileHeaderProps = {}) => {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="w-full px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2 sm:gap-4">
          {/* Left Section - Profile Navigation and Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Profile Navigation - Show before logo with small spacing */}
            {profileNavigation && (
              <div className="flex items-center flex-shrink-0">{profileNavigation}</div>
            )}

            {/* Logo */}
            <Logo className="flex-shrink-0" />
          </div>

          {/* Right Section - Theme Toggle and Profile Dropdown */}
          <HeaderActions />
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
