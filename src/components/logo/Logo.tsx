
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ 
  size = "md", 
  variant = "light",
  className 
}: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "relative", 
        sizeClasses[size],
        "aspect-square rounded-lg bg-gradient-to-br p-1",
        variant === "light" 
          ? "from-blue-500 to-indigo-700" 
          : "from-blue-400 to-indigo-600"
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1/2 w-1/2 rounded-full border-2 border-white/80"></div>
          <div className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
        </div>
      </div>
      <span className={cn(
        "font-semibold",
        size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl",
        variant === "light" ? "text-gray-900 dark:text-white" : "text-white"
      )}>
        DeviceHub
      </span>
    </div>
  );
}
