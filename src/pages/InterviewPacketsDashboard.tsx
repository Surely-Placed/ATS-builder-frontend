import DashboardLayout from "@/components/layouts/DashboardLayout";
import { InterviewPacketListView } from "@/features/interviewPacket";

/**
 * Interview Packets screen inside the dashboard (sidebar visible).
 * View-only: fetch and display generated packets. "Generate new packet" goes to /interview-packet/buy (purchase).
 */
export default function InterviewPacketsDashboard() {
  return (
    <DashboardLayout activeTab="Interview Packets">
      <InterviewPacketListView />
    </DashboardLayout>
  );
}
