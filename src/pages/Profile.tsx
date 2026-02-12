import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "@/features/resume/services/resumeService";
import { useToast } from "@/hooks/use-toast";
import { getStatus } from '@/features/subscription/services/subscriptionService';
import { useUsage } from '@/context/UsageContext';
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import ProfileSubscription from "@/features/profile/components/ProfileSubscription";

// Components
import { OverviewTab } from "@/features/profile/components/OverviewTab";
import { ProfileTab } from "@/features/profile/components/ProfileTab";
import { ResumeTab } from "@/features/profile/components/ResumeTab";
import { SubscriptionTab } from "@/features/profile/components/SubscriptionTab";
import { PurchasesTab } from "@/features/profile/components/PurchasesTab";
import { ActivityTab } from "@/features/profile/components/ActivityTab";
import { SettingsTab } from "@/features/profile/components/SettingsTab";
import { ApiKeysTab } from "@/features/profile/components/ApiKeysTab";

// Types
interface Profile {
  id: string;
  name: string;
  email: string;
  subscription_plan?: string;
  subscription_active?: boolean;
  subscription_start_date?: string;
  subscription_end_date?: string;
  subscription_id?: string;
  profile_resume_id?: string;
  last_login?: string;
  login_count?: number;
}

interface Subscription {
  plan: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  subscriptionId?: string;
  isExpired: boolean;
  daysRemaining: number | null;
}

interface Resume {
  id: string;
  original_file_url: string;
  optimized_file_url: string | null;
  created_at: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  plan: string | null;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  created_at: string;
}

interface Activity {
  id: string;
  activity_type: string;
  entity_type: string | null;
  description: string | null;
  created_at: string;
}

import type { AccountStats, RecentAnalysis } from "@/types/profile/overview";

interface Preferences {
  notifications: {
    email_analyses?: boolean;
    email_optimizations?: boolean;
    email_subscription?: boolean;
    email_marketing?: boolean;
  };
  display: {
    theme?: string;
    language?: string;
    date_format?: string;
  };
  analysis: {
    default_job_title?: string;
    preferred_format?: string;
    auto_optimize?: boolean;
  };
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Get active tab from URL path
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path === "/profile" || path === "/profile/") {
      return "overview";
    }
    const section = path.split("/profile/")[1];
    return section || "overview";
  };

  const activeTab = getActiveTabFromPath();

  // Get section heading based on active tab
  const getSectionHeading = () => {
    const headings: Record<string, { title: string; subtitle: string }> = {
      overview: {
        title: "Overview",
        subtitle: "View your account statistics and recent activity",
      },
      profile: {
        title: "Profile Information",
        subtitle: "Manage your personal information and account details",
      },
      resume: {
        title: "Profile Resume",
        subtitle: "Upload and manage your profile resume",
      },
      subscription: {
        title: "Subscription",
        subtitle: "View and manage your subscription plan",
      },
      purchases: {
        title: "Purchase History",
        subtitle: "View your transaction history and purchases",
      },
      activity: {
        title: "Activity History",
        subtitle: "Track your account activity and events",
      },
      settings: {
        title: "Settings & Preferences",
        subtitle: "Customize your account settings and preferences",
      },
      "api-keys": {
        title: "Extension API Keys",
        subtitle: "Generate and manage API keys for browser extensions",
      },
    };
    return (
      headings[activeTab] || {
        title: "Profile",
        subtitle: "Manage your account settings and preferences",
      }
    );
  };

  // Redirect to /profile/overview if just /profile
  useEffect(() => {
    if (location.pathname === "/profile" || location.pathname === "/profile/") {
      navigate("/profile/overview", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const setActiveTab = (tab: string) => {
    navigate(`/profile/${tab}`);
  };
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [profileResume, setProfileResume] = useState<Resume | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch functions
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<{ success: boolean; data: Profile }>("/profile");
      if (response.data.success) {
        setProfile(response.data.data);
      } else {
        throw new Error("Failed to load profile");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to load profile";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      // Use shared subscription status API to keep overview in sync with subscription page
      const s = await getStatus();
      // Map SubStatus -> Subscription shape used by overview
      const mapped: Subscription = {
        plan: s.plan,
        active: s.plan !== 'free',
        startDate: undefined,
        endDate: s.resetsAt ?? undefined,
        isExpired: false,
        daysRemaining: null,
      };
      if (s.resetsAt) {
        const reset = new Date(s.resetsAt);
        const now = new Date();
        const msPerDay = 24 * 60 * 60 * 1000;
        const diff = Math.ceil((reset.getTime() - now.getTime()) / msPerDay);
        mapped.daysRemaining = diff <= 0 ? 0 : diff;
      }
      setSubscription(mapped);
      // Also refresh shared usage context
      try {
        (useUsage().refresh || (async () => {}))();
      } catch (_) {}
    } catch (err: any) {
      console.error("Failed to load subscription:", err);
    }
  };

  const fetchProfileResume = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: { resume: Resume } }>(
        "/profile/resume"
      );
      if (response.data.success && response.data.data?.resume) {
        setProfileResume(response.data.data.resume);
      } else {
        setProfileResume(null);
      }
    } catch (err: any) {
      setProfileResume(null);
      console.error("Failed to load profile resume:", err);
    }
  };

  const fetchPurchaseHistory = async () => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { transactions: Transaction[] };
      }>("/profile/purchases");
      if (response.data.success) {
        setTransactions(response.data.data.transactions || []);
      }
    } catch (err: any) {
      console.error("Failed to load purchase history:", err);
    }
  };

  const fetchActivityHistory = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: { activities: Activity[] } }>(
        "/profile/activity"
      );
      if (response.data.success) {
        setActivities(response.data.data.activities || []);
      }
    } catch (err: any) {
      console.error("Failed to load activity history:", err);
    }
  };

  const fetchAccountStats = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: AccountStats }>(
        "/profile/stats"
      );
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err: any) {
      console.error("Failed to load account stats:", err);
    }
  };

  const fetchRecentAnalyses = async () => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { analyses: RecentAnalysis[]; count?: number };
      }>("/profile/analyses", { params: { limit: 5 } });
      if (response.data.success) {
        setRecentAnalyses(response.data.data?.analyses ?? []);
      }
    } catch (err: any) {
      console.error("Failed to load recent analyses:", err);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Preferences }>(
        "/profile/preferences"
      );
      if (response.data.success) {
        setPreferences(response.data.data);
      }
    } catch (err: any) {
      console.error("Failed to load preferences:", err);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    fetchProfile();
    fetchSubscription();
    fetchProfileResume();

    if (activeTab === "purchases") fetchPurchaseHistory();
    if (activeTab === "activity") fetchActivityHistory();
    if (activeTab === "overview") {
      fetchAccountStats();
      fetchRecentAnalyses();
    }
    if (activeTab === "settings") fetchPreferences();
  }, [activeTab]);

  // Refresh subscription info when window/tab regains focus or becomes visible
  useEffect(() => {
    const onFocus = () => {
      fetchSubscription();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchSubscription();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Update profile handler
  const handleUpdateProfile = async (data: { name: string; email: string }) => {
    try {
      setError(null);
      setSuccess(null);
      const response = await apiClient.put<{ success: boolean; data: Profile }>("/profile", data);
      if (response.data.success) {
        setProfile(response.data.data);
        setSuccess("Profile updated successfully!");
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update profile";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  // File upload handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (!allowedTypes.includes(file.type)) {
      const errorMessage = "Only PDF and DOCX files are allowed";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const errorMessage = "File size must be less than 5MB";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    await handleUploadProfileResume(file);
  };

  const handleUploadProfileResume = async (file: File) => {
    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<{ success: boolean; data: Resume | { resume: Resume } }>(
        "/profile/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // Handle different response formats from backend
        let resume: Resume | null = null;
        
        // Check if data is directly a Resume object
        if (response.data.data && 'id' in response.data.data && 'original_file_url' in response.data.data) {
          resume = response.data.data as Resume;
        }
        // Check if data is wrapped in a resume property
        else if (response.data.data && 'resume' in response.data.data) {
          resume = (response.data.data as { resume: Resume }).resume;
        }

        if (!resume || !resume.id) {
          console.error("Upload response data:", response.data);
          throw new Error("Upload succeeded but resume data was not returned in expected format");
        }

        setProfileResume(resume);
        toast({
          title: "Success",
          description: "Profile resume uploaded successfully!",
        });
        fetchProfile();

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error("Failed to upload profile resume");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to upload profile resume";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveProfileResume = async () => {
    try {
      setError(null);
      setSuccess(null);

      const response = await apiClient.delete<{ success: boolean; message?: string }>(
        "/profile/resume"
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Resume removed from profile",
        });
        setProfileResume(null);
        fetchProfile();
      } else {
        throw new Error(response.data.message || "Failed to remove resume");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to remove resume";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }
    try {
      setCancelling(true);
      setError(null);
      setSuccess(null);

      const response = await apiClient.post<{ success: boolean; message?: string }>(
        "/profile/subscription/cancel",
        {}
      );

      if (response.data.success) {
        setSuccess("Subscription cancelled successfully");
        toast({
          title: "Success",
          description: "Subscription cancelled successfully",
        });
        fetchSubscription();
        fetchProfile();
      } else {
        throw new Error(response.data.message || "Failed to cancel subscription");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to cancel subscription";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleUpdatePreferences = async (prefData: Partial<Preferences>) => {
    try {
      setError(null);
      setSuccess(null);
      const response = await apiClient.put<{ success: boolean; data: Preferences }>(
        "/profile/preferences",
        prefData
      );
      if (response.data.success) {
        setPreferences(response.data.data);
        setSuccess("Preferences updated successfully!");
        toast({
          title: "Success",
          description: "Preferences updated successfully!",
        });
      } else {
        throw new Error("Failed to update preferences");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to update preferences";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <ProfileLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex justify-center items-center min-h-[400px] flex-1">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="relative w-full h-full flex-1 flex flex-col">
        {/* Profile Heading - Below Header with Proper Spacing */}
        <div className="pl-4 sm:pl-6 lg:pl-8 pr-4 pt-6 pb-4 sm:pt-8 sm:pb-6">
          {(() => {
            const { title, subtitle } = getSectionHeading();
            return (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              </>
            );
          })()}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 sm:top-28 left-4 right-4 z-50 max-w-2xl mx-auto"
          >
            <Alert className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {success}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 sm:top-28 left-4 right-4 z-50 max-w-2xl mx-auto"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Main Content */}
        <div
          className="w-full overflow-y-auto scrollbar-hide flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", paddingRight: "0" }}
        >
          <div className="py-4 pl-4 sm:pl-6 lg:pl-8 pr-4">
            {activeTab === "overview" && (
              <OverviewTab
                stats={stats}
                recentAnalyses={recentAnalyses}
                subscription={subscription}
              />
            )}

            {activeTab === "profile" && (
              <ProfileTab profile={profile} onUpdate={handleUpdateProfile} />
            )}

            {activeTab === "resume" && (
              <ResumeTab
                profileResume={profileResume}
                uploading={uploading}
                onFileSelect={handleFileSelect}
                onRemove={handleRemoveProfileResume}
                fileInputRef={fileInputRef}
              />
            )}

            {activeTab === "subscription" && (
              <ProfileSubscription />
            )}

            {activeTab === "purchases" && <PurchasesTab transactions={transactions} />}

            {activeTab === "activity" && <ActivityTab activities={activities} />}

            {activeTab === "settings" && (
              <SettingsTab preferences={preferences} onUpdate={handleUpdatePreferences} />
            )}

            {activeTab === "api-keys" && <ApiKeysTab />}
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Profile;
