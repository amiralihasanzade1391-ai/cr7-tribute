"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type CursorVariant =
  | "default"
  | "hover"
  | "drag"
  | "text"
  | "play"
  | "view"
  | "like"
  | "siuuu"
  | "disabled";

interface CursorContextType {
  cursorVariant: CursorVariant;
  cursorLabel: string;
  magneticTarget: HTMLElement | null;
  setCursor: (variant: CursorVariant, label?: string) => void;
  resetCursor: () => void;
  setMagneticTarget: (element: HTMLElement | null) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>("default");
  const [cursorLabel, setCursorLabel] = useState<string>("");
  const [magneticTarget, setMagneticTarget] = useState<HTMLElement | null>(null);

  const setCursor = useCallback((variant: CursorVariant, label: string = "") => {
    setCursorVariant(variant);
    setCursorLabel(label);
  }, []);

  const resetCursor = useCallback(() => {
    setCursorVariant("default");
    setCursorLabel("");
    setMagneticTarget(null);
  }, []);

  return (
    <CursorContext.Provider
      value={{
        cursorVariant,
        cursorLabel,
        magneticTarget,
        setCursor,
        resetCursor,
        setMagneticTarget,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = (): CursorContextType => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
};
