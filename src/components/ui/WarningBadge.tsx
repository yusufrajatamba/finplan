import React from "react";
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from "lucide-react";

interface WarningBadgeProps {
  type?: "danger" | "warning" | "info";
  message: string;
  className?: string;
  icon?: React.ReactNode;
}

export const WarningBadge: React.FC<WarningBadgeProps> = ({
  type = "warning",
  message,
  className = "",
  icon,
}) => {
  const styles = {
    danger: "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300",
    warning: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300",
    info: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300",
  };

  const defaultIcons = {
    danger: <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />,
    warning: <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />,
    info: <Info className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />,
  };

  return (
    <div
      className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs font-medium ${styles[type]} ${className}`}
      role="alert"
    >
      {icon || defaultIcons[type]}
      <span className="leading-relaxed">{message}</span>
    </div>
  );
};
