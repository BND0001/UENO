import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import type { Influencer } from "@shared/schema";

export function TrackedInfluencers() {
  const { data: influencers } = useQuery<Influencer[]>({
    queryKey: ["/api/influencers"],
  });

  return (
    <Card className="bg-navy-800 border-navy-700">
      <CardHeader className="border-b border-navy-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Tracked Influencers</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {influencers?.slice(0, 4).map((influencer: any) => (
            <div key={influencer.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {influencer.avatar || influencer.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{influencer.name}</p>
                  <p className="text-xs text-slate-400">
                    {(influencer.followers / 1000000).toFixed(1)}M followers
                  </p>
                </div>
              </div>
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
