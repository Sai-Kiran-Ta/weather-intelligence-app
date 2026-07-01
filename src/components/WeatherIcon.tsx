import React from "react";
import * as Icons from "lucide-react";

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function WeatherIcon({ name, className = "", size = 24 }: WeatherIconProps) {
  // Safe lookup for Lucide icons
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[name];
  
  if (!IconComponent) {
    return <Icons.HelpCircle className={className} size={size} />;
  }
  
  return <IconComponent className={className} size={size} />;
}
