import React, { useState, useRef, useEffect } from "react";

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  warnIfOver?: number; // Threshold to show warning color
}

/**
 * MoneyInput — Input Rupiah dengan separator titik otomatis
 * - Tidak bisa scroll up/down (menggunakan type="text" bukan type="number")
 * - Format: Rp 5.000.000 saat user mengetik
 * - Store sebagai number di state parent
 */
export const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onChange,
  placeholder = "0",
  label,
  hint,
  id,
  disabled = false,
  className = "",
  warnIfOver,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState<string>(() =>
    value > 0 ? formatForDisplay(value) : ""
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Sync external value changes (e.g. when loading sample profile)
    if (!isFocused) {
      setDisplayValue(value > 0 ? formatForDisplay(value) : "");
    }
  }, [value, isFocused]);

  function formatForDisplay(num: number): string {
    return num.toLocaleString("id-ID");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Strip everything except digits
    const digitsOnly = raw.replace(/[^0-9]/g, "");
    const numValue = digitsOnly ? parseInt(digitsOnly, 10) : 0;

    // Format with thousand separators for display
    const formatted = numValue > 0 ? numValue.toLocaleString("id-ID") : "";
    setDisplayValue(formatted);
    onChange(numValue);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Prevent up/down arrow from changing value
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(true);
    e.target.select();
  }

  function handleBlur() {
    setIsFocused(false);
    // Re-format on blur
    setDisplayValue(value > 0 ? formatForDisplay(value) : "");
  }

  const isOverBudget = warnIfOver !== undefined && value > warnIfOver && warnIfOver > 0;

  const inputClasses = [
    "w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none",
    "bg-white dark:bg-slate-800",
    isOverBudget
      ? "border-rose-400 dark:border-rose-600 text-rose-700 dark:text-rose-400 focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700"
      : isFocused
      ? "border-blue-400 dark:border-blue-500 text-slate-900 dark:text-white ring-2 ring-blue-100 dark:ring-blue-900/50"
      : "border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600",
    disabled ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900" : "cursor-text",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 dark:text-slate-500 pointer-events-none select-none">
          Rp
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`${inputClasses} pl-9`}
        />
        {isOverBudget && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-rose-600 dark:text-rose-400">
            ⚠️ Melebihi
          </span>
        )}
      </div>

      {hint && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">{hint}</p>
      )}
    </div>
  );
};
