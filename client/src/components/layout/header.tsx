import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Bell } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateBriefMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/trend-brief/generate"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trend-briefs"] });
      toast({
        title: "Success",
        description: "Trend brief generated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate trend brief",
        variant: "destructive",
      });
    },
  });

  return (
    <header className="bg-navy-800 border-b border-navy-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-slate-400">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => generateBriefMutation.mutate()}
            disabled={generateBriefMutation.isPending}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {generateBriefMutation.isPending ? "Generating..." : "Generate Brief"}
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-navy-700">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
