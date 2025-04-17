
import { PropsWithChildren } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MoonIcon, Sun, Home, Landmark, Map, Settings, Users, LogOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/logo/Logo";
import { Link, useNavigate } from "react-router-dom";

export function Layout({ children }: PropsWithChildren) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader>
            <Logo variant={theme === "light" ? "light" : "dark"} />
          </SidebarHeader>
          <SidebarContent>
            <div className="space-y-1 px-2">
              <SidebarLink to="/" icon={<Home />} label="Dashboard" />
              <SidebarLink to="/devices" icon={<Landmark />} label="Devices" />
              <SidebarLink to="/map" icon={<Map />} label="Map View" />
              
              {/* Show admin links only for admin roles */}
              {user && (user.role === "engineer" || user.role === "customer_service" || user.role === "service_provider") && (
                <SidebarLink to="/users" icon={<Users />} label="Users" />
              )}
              
              <SidebarLink to="/settings" icon={<Settings />} label="Settings" />
            </div>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-3 py-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                className="mb-2"
              >
                {theme === "light" ? <MoonIcon /> : <Sun />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-destructive"
              >
                <LogOut />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-y-auto">
          <div className="container p-4">
            <div className="flex items-center justify-between mb-4">
              <SidebarTrigger />
              {user && (
                <div className="text-sm">
                  Logged in as <span className="font-semibold">{user.name}</span>
                </div>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function SidebarLink({ to, icon, label }: SidebarLinkProps) {
  return (
    <Button asChild variant="ghost" className="w-full justify-start">
      <Link to={to} className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  );
}
