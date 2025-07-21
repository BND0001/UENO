import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bot, Settings as SettingsIcon, Bell, Clock, Key, Trash2 } from "lucide-react";
import robotImage from "@assets/AI Agent_1753029379897.png";

export default function Settings() {
  return (
    <div className="flex h-screen overflow-hidden bg-navy-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Settings" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* AI Agent Settings */}
            <Card className="bg-navy-800 border-navy-700">
              <CardHeader className="border-b border-navy-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={robotImage} 
                      alt="Wavelet AI Agent" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <span>Wavelet AI Agent</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </CardTitle>
                    <p className="text-slate-400 text-sm">Created by UENO</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Auto Analysis</Label>
                        <p className="text-sm text-slate-400">Automatically analyze new posts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Real-time Monitoring</Label>
                        <p className="text-sm text-slate-400">Live tracking of influencer activity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Sentiment Analysis</Label>
                        <p className="text-sm text-slate-400">AI-powered sentiment detection</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Analysis Frequency</Label>
                      <Select defaultValue="realtime">
                        <SelectTrigger className="mt-2 bg-navy-700 border-navy-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Every Hour</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-white">AI Model</Label>
                      <Select defaultValue="gpt-4o">
                        <SelectTrigger className="mt-2 bg-navy-700 border-navy-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o">GPT-4o (Latest)</SelectItem>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trend Brief Settings */}
            <Card className="bg-navy-800 border-navy-700">
              <CardHeader className="border-b border-navy-700">
                <CardTitle className="text-white flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span>Trend Brief Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Generation Schedule</Label>
                      <Select defaultValue="48h">
                        <SelectTrigger className="mt-2 bg-navy-700 border-navy-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">Every 24 hours</SelectItem>
                          <SelectItem value="48h">Every 48 hours</SelectItem>
                          <SelectItem value="72h">Every 72 hours</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-white">Minimum Posts Required</Label>
                      <Input 
                        type="number" 
                        defaultValue="10" 
                        className="mt-2 bg-navy-700 border-navy-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Auto Generation</Label>
                        <p className="text-sm text-slate-400">Generate briefs automatically</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Email Notifications</Label>
                        <p className="text-sm text-slate-400">Send briefs to email</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6 bg-navy-600" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Next Brief Generation</h4>
                    <p className="text-sm text-slate-400">23 hours 45 minutes remaining</p>
                  </div>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Generate Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-navy-800 border-navy-700">
              <CardHeader className="border-b border-navy-700">
                <CardTitle className="text-white flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-orange-400" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">New Posts Alerts</Label>
                      <p className="text-sm text-slate-400">Get notified when tracked influencers post</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Trend Alerts</Label>
                      <p className="text-sm text-slate-400">Alert when new trends are detected</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Sentiment Warnings</Label>
                      <p className="text-sm text-slate-400">Alert on negative sentiment spikes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Weekly Summaries</Label>
                      <p className="text-sm text-slate-400">Email summary reports</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API & Integrations */}
            <Card className="bg-navy-800 border-navy-700">
              <CardHeader className="border-b border-navy-700">
                <CardTitle className="text-white flex items-center space-x-2">
                  <Key className="h-5 w-5 text-green-400" />
                  <span>API & Integrations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-navy-900 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">OpenAI API</h4>
                        <p className="text-sm text-slate-400">Connected</p>
                      </div>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-navy-900 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Social Media APIs</h4>
                        <p className="text-sm text-slate-400">Not configured</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white">Webhook URL</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input 
                        placeholder="https://your-webhook-url.com/webhook" 
                        className="bg-navy-700 border-navy-600 text-white"
                      />
                      <Button variant="outline">Save</Button>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">Receive real-time notifications via webhook</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-navy-800 border-red-600">
              <CardHeader className="border-b border-red-600">
                <CardTitle className="text-white flex items-center space-x-2">
                  <Trash2 className="h-5 w-5 text-red-400" />
                  <span>Danger Zone</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Clear All Data</h4>
                      <p className="text-sm text-slate-400">Remove all tracked influencers and posts</p>
                    </div>
                    <Button variant="destructive">Clear Data</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Reset AI Agent</h4>
                      <p className="text-sm text-slate-400">Reset all AI analysis and learning</p>
                    </div>
                    <Button variant="destructive">Reset Agent</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}