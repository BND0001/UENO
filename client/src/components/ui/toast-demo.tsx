import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ToastDemo() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: "Test Toast",
          description: "This is a test toast message",
        });
      }}
    >
      Test Toast
    </Button>
  );
}