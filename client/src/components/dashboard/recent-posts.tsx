import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Activity } from "lucide-react";

export function RecentPosts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts/recent"],
  });

  if (isLoading) {
    return (
      <Card className="bg-navy-800 border-navy-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">Loading posts...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-navy-800 border-navy-700">
      <CardHeader className="border-b border-navy-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Recent Posts</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Real-time</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {posts?.map((post: any) => (
            <div key={post.id} className="flex space-x-4 p-4 bg-navy-900 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {post.influencer?.avatar || post.influencer?.name?.charAt(0) || "?"}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-white">
                    {post.influencer?.name || "Unknown"}
                  </span>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {post.platform}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{post.likes?.toLocaleString() || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{post.comments?.toLocaleString() || 0}</span>
                    </span>
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
                    {post.sentiment || "Neutral"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
