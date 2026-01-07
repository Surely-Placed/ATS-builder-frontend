import ProfileHeader from "./ProfileLayoutHeader";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";

interface ProfileLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileLayout = ({ children, activeTab, onTabChange }: ProfileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background w-full h-full flex flex-col">
      <ProfileHeader
        profileNavigation={<ProfileSidebar activeTab={activeTab} onTabChange={onTabChange} />}
      />

      <div className="relative w-full h-full flex-1 flex flex-col">{children}</div>
    </div>
  );
};

export default ProfileLayout;
