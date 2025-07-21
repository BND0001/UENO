import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export function TrendingTopics() {
  const { data: topics } = useQuery({
    queryKey: ["/api/trending-topics"],
  });

  return (
    <Card className="bg-navy-800 border-navy-700">
      <CardHeader className="border-b border-navy-700">
        <CardTitle className="text-white">Trending Topics</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {topics?.slice(0, 5).map((topic: any) => (
            <div key={topic.id} className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{topic.name}</span>
              <span className="text-xs text-green-400">+{topic.growth}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
