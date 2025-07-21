import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Users, 
  Eye, 
  FileText, 
  Settings,
  Zap,
  Bot
} from "lucide-react";
import robotImage from "@assets/AI Agent_1753029379897.png";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Influencers", href: "/influencers", icon: Users },
  { name: "Monitoring", href: "/monitoring", icon: Eye },
  { name: "Trend Briefs", href: "/trend-briefs", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-navy-800 border-r border-navy-700 flex flex-col">
      {/* Logo & Branding */}
      <div className="p-6 border-b border-navy-700">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-xl font-bold text-white">Wavelet</h1>
            <p className="text-xs text-slate-400">by UENO</p>
          </div>
        </div>
      </div>

      {/* AI Agent Section */}
      <div className="p-4 border-b border-navy-700">
        <div className="flex items-center space-x-3 p-3 bg-navy-700 rounded-lg">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={robotImage} 
              alt="Wavelet AI Agent" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="font-medium text-white">AI Agent</p>
            <p className="text-xs text-green-400">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
              Active
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start space-x-3 p-3 h-auto",
                      isActive
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "text-slate-300 hover:bg-navy-700 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Next Brief Countdown */}
      <div className="p-4 border-t border-navy-700">
        <div className="bg-navy-700 p-3 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Next Trend Brief</p>
          <p className="text-lg font-semibold text-blue-400">23h 45m</p>
        </div>
      </div>
    </div>
  );
}
