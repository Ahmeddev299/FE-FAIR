"use client";

import React from "react";

type SwitchProps = {
  isOn: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
};

const Switch: React.FC<SwitchProps> = ({ isOn, onChange, disabled = false, ariaLabel }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        aria-label={ariaLabel}
        checked={isOn}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-checked:bg-blue-600 transition-colors">
        <div className={`absolute top-[2px] left-[2px] h-5 w-5 bg-white border border-gray-300 rounded-full transition-all ${isOn ? "translate-x-full" : ""}`} />
      </div>
    </label>
  );
};

export default Switch;
