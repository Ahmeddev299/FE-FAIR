import clsx from "clsx";
import React from "react";

type BtnProps = {
  label: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const ChipBtn = ({ label, icon, className, ...rest }: BtnProps) => (
  <button
    className={clsx(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
      "border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition",
      className
    )}
    {...rest}
  >
    {icon && <span className="shrink-0">{icon}</span>}
    <span>{label}</span>
  </button>
);

export const PrimaryBtn = ({ label, icon, className, ...rest }: BtnProps) => (
  <button
    className={clsx(
      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium",
      "border-blue-200 text-blue-700 bg-white hover:bg-blue-50 transition",
      className
    )}
    {...rest}
  >
    {icon && <span className="shrink-0">{icon}</span>}
    <span>{label}</span>
  </button>
);

export const IconBtn = ({ label, icon, className, ...rest }: BtnProps) => (
  <button
    aria-label={label}
    title={label}
    className={clsx("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm",
      "border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition", className)}
    {...rest}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);
