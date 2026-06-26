"use client";
import { useState, type ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { HorizontalTrack } from "./HorizontalTrack";
import { MoodBackground } from "./MoodBackground";

export function Experience({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  return (
    <SmoothScroll>
      <MoodBackground progress={progress} />
      <HorizontalTrack onProgress={setProgress}>{children}</HorizontalTrack>
    </SmoothScroll>
  );
}
