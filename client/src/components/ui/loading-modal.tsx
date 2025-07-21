import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Bot } from "lucide-react";

interface LoadingModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  progress: number;
  details: string;
}

export function LoadingModal({ 
  open, 
  onClose, 
  title, 
  description, 
  progress, 
  details 
}: LoadingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-navy-800 border-navy-700 max-w-md">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-slate-400 mb-4">{description}</p>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-slate-400">{details}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
