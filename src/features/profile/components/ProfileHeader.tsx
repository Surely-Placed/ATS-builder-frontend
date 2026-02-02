import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

interface ProfileHeaderProps {
  name: string;
  email: string;
  subscriptionActive?: boolean;
  subscriptionPlan?: string;
}

export const ProfileHeader = ({ name, email }: ProfileHeaderProps) => {
  const { user } = useAuth();

  const getInitials = (name: string, email: string) => {
    if (name && name.length > 0) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email && email.length > 0) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full mb-8"
    >
      <div className="bg-card rounded-xl p-6 shadow-sm border ml-8 mr-4">
        <div className="flex items-center">
          {/* Avatar and User Info - Left Aligned */}
          <div className="flex items-center gap-5">
            {/* Avatar with blue border */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-[3px] border-primary overflow-hidden">
                {user?.photoURL ? (
                  <Avatar className="w-full h-full">
                    <AvatarImage src={user.photoURL} alt={name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                      {getInitials(name, email)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold">
                    {getInitials(name, email)}
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">{name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
