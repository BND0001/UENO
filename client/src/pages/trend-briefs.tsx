import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Download, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingModal } from "@/components/ui/loading-modal";
import { useState } from "react";

export default function TrendBriefs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const { data: briefs, isLoading } = useQuery({
    queryKey: ["/api/trend-briefs"],
  });

  const generateMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/trend-brief/generate"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trend-briefs"] });
      setShowGenerateModal(false);
      toast({
        title: "Success",
        description: "Trend brief generated successfully!",
      });
    },
    onError: () => {
      setShowGenerateModal(false);
      toast({
        title: "Error",
        description: "Failed to generate trend brief",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    setShowGenerateModal(true);
    generateMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-navy-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Trend Briefs" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="text-center">Loading trend briefs...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-navy-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Trend Briefs" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Trend Briefs</h2>
              <p className="text-slate-400">AI-generated insights and trend analysis</p>
            </div>
            <Button onClick={handleGenerate} className="bg-blue-500 hover:bg-blue-600">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate New Brief
            </Button>
          </div>

          <div className="space-y-6">
            {briefs?.map((brief: any) => (
              <Card key={brief.id} className="bg-navy-800 border-navy-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{brief.title}</CardTitle>
                        <p className="text-slate-400 text-sm">
                          {new Date(brief.generatedAt).toLocaleDateString()} • {brief.postsAnalyzed} posts analyzed
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Executive Summary</h4>
                      <p className="text-slate-300 text-sm">{brief.summary}</p>
                    </div>

                    {brief.keyTrends && brief.keyTrends.length > 0 && (
                      <div>
                        <h4 className="text-blue-400 font-medium mb-2">Key Trends</h4>
                        <div className="space-y-2">
                          {brief.keyTrends.map((trend: string, index: number) => (
                            <div key={index} className="bg-navy-900 p-3 rounded-lg">
                              <p className="text-slate-300 text-sm">{trend}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {brief.opportunities && brief.opportunities.length > 0 && (
                      <div>
                        <h4 className="text-green-400 font-medium mb-2">Opportunities</h4>
                        <div className="space-y-2">
                          {brief.opportunities.map((opportunity: string, index: number) => (
                            <div key={index} className="bg-navy-900 p-3 rounded-lg">
                              <p className="text-slate-300 text-sm">{opportunity}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {brief.alerts && brief.alerts.length > 0 && (
                      <div>
                        <h4 className="text-orange-400 font-medium mb-2">Alerts</h4>
                        <div className="space-y-2">
                          {brief.alerts.map((alert: string, index: number) => (
                            <div key={index} className="bg-navy-900 p-3 rounded-lg">
                              <p className="text-slate-300 text-sm">{alert}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!briefs || briefs.length === 0) && (
              <Card className="bg-navy-800 border-navy-700">
                <CardContent className="text-center py-12">
                  <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">No Trend Briefs Yet</h3>
                  <p className="text-slate-400 mb-4">Generate your first AI-powered trend brief to get started</p>
                  <Button onClick={handleGenerate} className="bg-blue-500 hover:bg-blue-600">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate First Brief
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <LoadingModal 
        open={showGenerateModal} 
        onClose={() => setShowGenerateModal(false)}
        title="Generating Trend Brief"
        description="Wavelet AI is analyzing the latest posts and trends..."
        progress={65}
        details="Processing posts across tracked influencers"
      />
    </div>
  );
}
