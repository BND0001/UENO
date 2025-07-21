import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Users, BarChart3, TrendingUp, Heart } from "lucide-react";

interface DashboardMetrics {
  trackedInfluencers: number;
  postsAnalyzed: number;
  trendingTopics: number;
  engagementScore: number;
}

export function MetricsCards() {
  const { data: metrics } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  const cards = [
    {
      title: "Tracked Influencers",
      value: metrics?.trackedInfluencers || 0,
      change: "+3 this week",
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: "Posts Analyzed",
      value: metrics?.postsAnalyzed || 0,
      change: "+12% today",
      icon: BarChart3,
      color: "text-green-400",
    },
    {
      title: "Trending Topics",
      value: metrics?.trendingTopics || 0,
      change: "+5 new trends",
      icon: TrendingUp,
      color: "text-orange-400",
    },
    {
      title: "Engagement Score",
      value: `${metrics?.engagementScore || 0}%`,
      change: "+7% vs last week",
      icon: Heart,
      color: "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="bg-navy-800 border-navy-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">{card.title}</h3>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="text-3xl font-bold text-white mb-2">{card.value}</p>
            <p className="text-sm text-green-400">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {card.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
