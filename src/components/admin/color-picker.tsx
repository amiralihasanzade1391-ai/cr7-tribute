"use client";

import React from "react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
}) => {
  // Ensure valid 6-char hex for native input type="color"
  const hexValue =
    value && value.startsWith("#") && (value.length === 7 || value.length === 4)
      ? value
      : "#DA291C";

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
        {label}
      </label>
      <div className="flex items-center space-x-2 bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 focus-within:border-yellow-400 transition">
        <input
          type="color"
          value={hexValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0 shrink-0"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#FFFFFF or rgba(...)"
          className="w-full bg-transparent text-xs font-mono text-zinc-200 focus:outline-none"
        />
      </div>
    </div>
  );
};
