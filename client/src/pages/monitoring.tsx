import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Eye, Heart, MessageCircle, Share } from "lucide-react";

export default function Monitoring() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts/recent"],
  });

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-navy-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Monitoring" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="text-center">Loading posts...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-navy-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Monitoring" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Real-time Monitoring</h2>
                <p className="text-slate-400">Live feed of tracked influencer activity</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Live</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {posts?.map((post: any) => (
              <Card key={post.id} className="bg-navy-800 border-navy-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {post.influencer?.avatar || post.influencer?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <CardTitle className="text-white">{post.influencer?.name || "Unknown"}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Badge variant="secondary" className="capitalize">
                            {post.platform}
                          </Badge>
                          <span>{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        post.sentiment === "positive" ? "default" : 
                        post.sentiment === "negative" ? "destructive" : "secondary"
                      }
                      className={
                        post.sentiment === "positive" ? "bg-green-500 text-white" :
                        post.sentiment === "negative" ? "bg-red-500 text-white" :
                        "bg-blue-500 text-white"
                      }
                    >
                      {post.sentiment || "neutral"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">{post.content}</p>
                  
                  {post.aiSummary && (
                    <div className="bg-navy-900 p-3 rounded-lg mb-4">
                      <h4 className="text-blue-400 text-sm font-medium mb-1">AI Summary</h4>
                      <p className="text-slate-300 text-sm">{post.aiSummary}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share className="h-4 w-4" />
                        <span>{post.shares?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                    
                    {post.topics && post.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.topics.slice(0, 3).map((topic: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
