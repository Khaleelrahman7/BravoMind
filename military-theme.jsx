import React from 'react';
import { cn } from './utils';

// Military-themed Button Component
export const MilitaryButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) => {
  const baseClasses = "font-semibold transition-all duration-200 border-2 uppercase tracking-wider";
  
  const variants = {
    primary: "bg-slate-800 text-green-400 border-green-400 hover:bg-green-400 hover:text-slate-900",
    secondary: "bg-transparent text-green-400 border-green-400 hover:bg-green-400 hover:text-slate-900",
    danger: "bg-red-800 text-red-200 border-red-400 hover:bg-red-400 hover:text-slate-900",
    success: "bg-green-800 text-green-200 border-green-400 hover:bg-green-400 hover:text-slate-900"
  };
  
  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button 
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// Military-themed Card Component
export const TacticalCard = ({ 
  children, 
  title, 
  status, 
  className, 
  ...props 
}) => {
  const statusColors = {
    active: "border-green-400 bg-slate-800/50",
    completed: "border-blue-400 bg-slate-800/30",
    pending: "border-yellow-400 bg-slate-800/40",
    critical: "border-red-400 bg-slate-800/60"
  };
  
  return (
    <div 
      className={cn(
        "border-2 rounded-lg p-4 backdrop-blur-sm",
        status ? statusColors[status] : "border-slate-600 bg-slate-800/40",
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="text-green-400 font-bold uppercase tracking-wider text-sm mb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

// Status Indicator Component
export const StatusIndicator = ({ 
  status, 
  label, 
  size = 'md' 
}) => {
  const statusColors = {
    online: "bg-green-400",
    offline: "bg-red-400",
    warning: "bg-yellow-400",
    unknown: "bg-gray-400"
  };
  
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className={cn(
          "rounded-full animate-pulse",
          statusColors[status] || statusColors.unknown,
          sizes[size]
        )}
      />
      {label && (
        <span className="text-slate-300 text-sm font-medium">
          {label}
        </span>
      )}
    </div>
  );
};

// Military Progress Bar
export const TacticalProgress = ({ 
  value, 
  max = 100, 
  label, 
  className 
}) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between text-sm text-slate-300 mb-1">
          <span>{label}</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div className="w-full bg-slate-700 rounded-full h-2 border border-slate-600">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Military Badge Component
export const MilitaryBadge = ({ 
  rank, 
  branch, 
  className 
}) => {
  const branchColors = {
    army: "text-green-400 border-green-400",
    navy: "text-blue-400 border-blue-400",
    airforce: "text-cyan-400 border-cyan-400",
    marines: "text-red-400 border-red-400",
    coastguard: "text-orange-400 border-orange-400"
  };
  
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider",
      branchColors[branch] || branchColors.army,
      className
    )}>
      <span>{rank}</span>
      <span>•</span>
      <span>{branch}</span>
    </div>
  );
};

