import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInfluencerSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, Youtube, Instagram, Linkedin } from "lucide-react";
import { z } from "zod";

interface AddInfluencerModalProps {
  open: boolean;
  onClose: () => void;
}

const formSchema = insertInfluencerSchema.extend({
  platform: z.enum(["youtube", "instagram", "linkedin", "twitter"]),
});

type FormData = z.infer<typeof formSchema>;

interface SearchResult {
  name: string;
  username: string;
  platform: string;
  followers: number;
  avatar: string;
  verified?: boolean;
}

const POPULAR_INFLUENCERS: SearchResult[] = [
  {
    name: "Ali Abdaal",
    username: "@aliabdaal",
    platform: "youtube",
    followers: 3200000,
    avatar: "AA",
    verified: true,
  },
  {
    name: "MKBHD",
    username: "@mkbhd", 
    platform: "youtube",
    followers: 17800000,
    avatar: "MK",
    verified: true,
  },
  {
    name: "MrBeast",
    username: "@mrbeast",
    platform: "youtube", 
    followers: 200000000,
    avatar: "MB",
    verified: true,
  },
  {
    name: "PewDiePie",
    username: "@pewdiepie",
    platform: "youtube",
    followers: 111000000,
    avatar: "PP",
    verified: true,
  },
  {
    name: "Ninja",
    username: "@ninja",
    platform: "youtube",
    followers: 24000000,
    avatar: "NJ",
    verified: true,
  },
  {
    name: "Gary Vaynerchuk",
    username: "@garyvee",
    platform: "instagram",
    followers: 10200000,
    avatar: "GV",
    verified: true,
  }
];

export function AddInfluencerModal({ open, onClose }: AddInfluencerModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      platform: "youtube",
      followers: 0,
      avatar: "",
      isActive: true,
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/influencers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/influencers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Influencer added successfully",
      });
      onClose();
      form.reset();
      setSelectedResult(null);
      setSearchResults([]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add influencer",
        variant: "destructive",
      });
    },
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Use real YouTube API for searching
      const response = await fetch(`/api/youtube/search?query=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const youtubeChannels = await response.json();
        
        // Convert YouTube API response to our format
        const results: SearchResult[] = youtubeChannels.map((channel: any) => ({
          name: channel.title,
          username: `@${channel.title.toLowerCase().replace(/\s+/g, '')}`,
          platform: "youtube",
          followers: parseInt(channel.statistics?.subscriberCount || "0"),
          avatar: channel.title.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
          verified: true,
        }));
        
        setSearchResults(results);
      } else {
        // Fallback to popular influencers if API fails
        const results = POPULAR_INFLUENCERS.filter(
          result =>
            result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);
      // Fallback to popular influencers on error
      const results = POPULAR_INFLUENCERS.filter(
        result =>
          result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const selectInfluencer = (result: SearchResult) => {
    setSelectedResult(result);
    form.setValue("name", result.name);
    form.setValue("username", result.username);
    form.setValue("platform", result.platform as any);
    form.setValue("followers", result.followers);
    form.setValue("avatar", result.avatar);
  };

  const onSubmit = (data: FormData) => {
    addMutation.mutate(data);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube": return <Youtube className="h-4 w-4 text-red-500" />;
      case "instagram": return <Instagram className="h-4 w-4 text-pink-500" />;
      case "linkedin": return <Linkedin className="h-4 w-4 text-blue-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-navy-800 border-navy-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Influencer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Popular Influencers Section */}
          {searchResults.length === 0 && !isSearching && (
            <div className="space-y-4">
              <Label className="text-white">Popular Influencers</Label>
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                {POPULAR_INFLUENCERS.slice(0, 6).map((influencer, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer bg-navy-700 hover:bg-navy-600 transition-colors"
                    onClick={() => selectInfluencer(influencer)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {influencer.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{influencer.name}</div>
                      <div className="flex items-center space-x-1 text-xs text-slate-400">
                        {getPlatformIcon(influencer.platform)}
                        <span>{(influencer.followers / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <span className="text-slate-400 text-sm">or search for any influencer below</span>
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="space-y-4">
            <Label className="text-white">Search Any Influencer</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Search by name or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-navy-700 border-navy-600 text-white"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery.trim()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <Label className="text-white">Search Results</Label>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedResult?.username === result.username
                      ? "bg-blue-500/20 border border-blue-500"
                      : "bg-navy-700 hover:bg-navy-600"
                  }`}
                  onClick={() => selectInfluencer(result)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {result.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{result.name}</span>
                        {result.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-400">
                        {getPlatformIcon(result.platform)}
                        <span>{result.username}</span>
                        <span>•</span>
                        <span>{(result.followers / 1000000).toFixed(1)}M followers</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Manual Entry Form */}
          <div className="space-y-4 pt-4 border-t border-navy-700">
            <Label className="text-white">{selectedResult ? "Review & Confirm" : "Or Add Manually"}</Label>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Name</Label>
                  <Input
                    {...form.register("name")}
                    className="bg-navy-700 border-navy-600 text-white"
                    placeholder="Influencer name"
                  />
                </div>
                <div>
                  <Label className="text-white">Username</Label>
                  <Input
                    {...form.register("username")}
                    className="bg-navy-700 border-navy-600 text-white"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <Label className="text-white">Platform</Label>
                  <Select
                    value={form.watch("platform")}
                    onValueChange={(value) => form.setValue("platform", value as any)}
                  >
                    <SelectTrigger className="bg-navy-700 border-navy-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Followers</Label>
                  <Input
                    type="number"
                    {...form.register("followers", { valueAsNumber: true })}
                    className="bg-navy-700 border-navy-600 text-white"
                    placeholder="1000000"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addMutation.isPending || !form.watch("name") || !form.watch("username")}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {addMutation.isPending ? "Adding..." : selectedResult ? "Add Selected Influencer" : "Add Influencer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}