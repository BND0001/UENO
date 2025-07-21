import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { RecentPosts } from "@/components/dashboard/recent-posts";
import { TrackedInfluencers } from "@/components/dashboard/tracked-influencers";
import { TrendingTopics } from "@/components/dashboard/trending-topics";
import { AIInsights } from "@/components/dashboard/ai-insights";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-navy-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        <main className="flex-1 overflow-y-auto p-6">
          <MetricsCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <RecentPosts />
            </div>
            <div className="space-y-6">
              <TrackedInfluencers />
              <TrendingTopics />
              <AIInsights />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
