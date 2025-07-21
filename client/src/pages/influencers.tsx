import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Trash2, Users, Youtube, Instagram, Linkedin, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddInfluencerModal } from "@/components/ui/add-influencer-modal";
import { RefreshButton } from "@/components/ui/refresh-button";
import type { Influencer } from "@shared/schema";

export default function Influencers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: influencers, isLoading } = useQuery<Influencer[]>({
    queryKey: ["/api/influencers"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/influencers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/influencers"] });
      toast({
        title: "Success",
        description: "Influencer removed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove influencer",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-navy-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Influencers" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="text-center">Loading influencers...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-navy-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Influencers" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Tracked Influencers</h2>
              <p className="text-slate-400">Manage your influencer monitoring list</p>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Influencer
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {influencers?.map((influencer) => (
              <Card key={influencer.id} className="bg-navy-800 border-navy-700">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                          {influencer.avatar || influencer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-white text-lg">{influencer.name}</CardTitle>
                        <p className="text-slate-400 text-sm">{influencer.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RefreshButton 
                        influencerId={influencer.id} 
                        influencerName={influencer.name} 
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(influencer.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Platform</span>
                      <div className="flex items-center space-x-1">
                        {influencer.platform === "youtube" && <Youtube className="h-4 w-4 text-red-500" />}
                        {influencer.platform === "instagram" && <Instagram className="h-4 w-4 text-pink-500" />}
                        {influencer.platform === "linkedin" && <Linkedin className="h-4 w-4 text-blue-500" />}
                        {influencer.platform === "twitter" && <Twitter className="h-4 w-4 text-blue-400" />}
                        <Badge variant="secondary" className="capitalize">
                          {influencer.platform}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Followers</span>
                      <div className="flex items-center space-x-1 text-white">
                        <Users className="h-4 w-4" />
                        <span>{(influencer.followers / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Status</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 text-sm">Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>

      <AddInfluencerModal 
        open={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </div>
  );
}
