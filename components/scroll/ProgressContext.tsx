"use client";
import { createContext, useContext } from "react";

/** Live global scroll progress (0..1) across the horizontal track. */
export const ProgressContext = createContext(0);
export const useProgress = () => useContext(ProgressContext);
