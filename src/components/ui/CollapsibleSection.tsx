import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

export type SectionColorScheme =
  | "emerald"
  | "blue"
  | "rose"
  | "indigo"
  | "amber"
  | "purple"
  | "teal"
  | "slate";

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  colorScheme?: SectionColorScheme;
  defaultExpanded?: boolean;
  badge?: string | number;
  warningMessage?: string; // Shows warning banner inside when expanded
  children: React.ReactNode;
  id?: string;
}

const COLOR_MAPS: Record<
  SectionColorScheme,
  { header: string; icon: string; border: string; badge: string }
> = {
  emerald: {
    header: "bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/50",
    icon: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800/50",
    badge: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
  },
  blue: {
    header: "bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-950/50",
    icon: "bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800/50",
    badge: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  },
  rose: {
    header: "bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100/70 dark:hover:bg-rose-950/50",
    icon: "bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800/50",
    badge: "bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300",
  },
  indigo: {
    header: "bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100/70 dark:hover:bg-indigo-950/50",
    icon: "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800/50",
    badge: "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300",
  },
  amber: {
    header: "bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100/70 dark:hover:bg-amber-950/50",
    icon: "bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800/50",
    badge: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
  },
  purple: {
    header: "bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100/70 dark:hover:bg-purple-950/50",
    icon: "bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800/50",
    badge: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  },
  teal: {
    header: "bg-teal-50 dark:bg-teal-950/30 hover:bg-teal-100/70 dark:hover:bg-teal-950/50",
    icon: "bg-teal-100 dark:bg-teal-900/60 text-teal-600 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-800/50",
    badge: "bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300",
  },
  slate: {
    header: "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800",
    icon: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
    badge: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  },
};

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  icon,
  colorScheme = "slate",
  defaultExpanded = true,
  badge,
  warningMessage,
  children,
  id,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const colors = COLOR_MAPS[colorScheme];

  return (
    <div
      id={id}
      className={`rounded-2xl border overflow-hidden shadow-sm transition-shadow duration-200 ${
        isExpanded ? "shadow-md" : "shadow-xs"
      } ${colors.border}`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`w-full flex items-center justify-between px-5 py-4 transition-colors duration-150 cursor-pointer ${colors.header}`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3 min-w-0">
          {icon && (
            <div className={`p-2 rounded-xl shrink-0 ${colors.icon}`}>
              {icon}
            </div>
          )}
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                {title}
              </h3>
              {badge !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                  {badge}
                </span>
              )}
              {warningMessage && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-3 h-3" />
                  Peringatan
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className={`shrink-0 ml-3 transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"}`}>
          <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </div>
      </button>

      {/* Content with smooth animation */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Warning Banner */}
        {warningMessage && isExpanded && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
              {warningMessage}
            </p>
          </div>
        )}

        <div
          ref={contentRef}
          className="p-5 bg-white dark:bg-slate-900"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
