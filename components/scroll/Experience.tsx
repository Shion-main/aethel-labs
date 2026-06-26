"use client";
import { useState, type ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { HorizontalTrack } from "./HorizontalTrack";
import { MoodBackground } from "./MoodBackground";
import { ProgressContext } from "./ProgressContext";

export function Experience({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  return (
    <SmoothScroll>
      <ProgressContext.Provider value={progress}>
        <MoodBackground progress={progress} />
        <HorizontalTrack onProgress={setProgress}>{children}</HorizontalTrack>
      </ProgressContext.Provider>
    </SmoothScroll>
  );
}
