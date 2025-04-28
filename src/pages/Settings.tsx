import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Moon, Sun, BellRing, Languages, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({
    deviceAlerts: true,
    statusUpdates: true,
    maintenanceReminders: true,
    systemAnnouncements: false
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme-toggle">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch 
                  id="theme-toggle"
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
            <CardDescription>Manage your language preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">Display Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ar">Arabic (RTL)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                The selected language will be applied to the entire interface
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="device-alerts" className="flex-1">Device Alerts</Label>
                <Switch 
                  id="device-alerts"
                  checked={notifications.deviceAlerts}
                  onCheckedChange={(checked) => setNotifications({...notifications, deviceAlerts: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="status-updates" className="flex-1">Status Updates</Label>
                <Switch 
                  id="status-updates"
                  checked={notifications.statusUpdates}
                  onCheckedChange={(checked) => setNotifications({...notifications, statusUpdates: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-reminders" className="flex-1">Maintenance Reminders</Label>
                <Switch 
                  id="maintenance-reminders"
                  checked={notifications.maintenanceReminders}
                  onCheckedChange={(checked) => setNotifications({...notifications, maintenanceReminders: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="system-announcements" className="flex-1">System Announcements</Label>
                <Switch 
                  id="system-announcements"
                  checked={notifications.systemAnnouncements}
                  onCheckedChange={(checked) => setNotifications({...notifications, systemAnnouncements: checked})}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm">Email Address</Label>
                <p className="font-medium">admin@example.com</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground text-sm">Role</Label>
                <p className="font-medium">Engineer</p>
              </div>
              
              <Separator />
              
              <div className="pt-2 flex flex-col gap-3">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Edit Profile</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
