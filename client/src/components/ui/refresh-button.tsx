import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RefreshButtonProps {
  influencerId: number;
  influencerName: string;
}

export function RefreshButton({ influencerId, influencerName }: RefreshButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const refreshMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/influencers/${influencerId}/refresh`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Content Refreshed",
        description: `Checking for new content from ${influencerName}`,
      });
    },
    onError: () => {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh content at this time",
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => refreshMutation.mutate()}
      disabled={refreshMutation.isPending}
      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
    >
      <RefreshCw className={`h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
    </Button>
  );
}