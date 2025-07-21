import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Bot } from "lucide-react";

interface AIInsightsData {
  keyTrend: string;
  opportunity: string;
  alert: string;
}

export function AIInsights() {
  const { data: insights } = useQuery<AIInsightsData>({
    queryKey: ["/api/ai-insights"],
  });

  return (
    <Card className="bg-navy-800 border-navy-700">
      <CardHeader className="border-b border-navy-700">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-white">AI Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="bg-navy-900 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-400 mb-2">Key Trend</h4>
            <p className="text-sm text-slate-300">
              {insights?.keyTrend || "Loading insights..."}
            </p>
          </div>
          <div className="bg-navy-900 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-400 mb-2">Opportunity</h4>
            <p className="text-sm text-slate-300">
              {insights?.opportunity || "Loading insights..."}
            </p>
          </div>
          <div className="bg-navy-900 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-orange-400 mb-2">Alert</h4>
            <p className="text-sm text-slate-300">
              {insights?.alert || "Loading insights..."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
