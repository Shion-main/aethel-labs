"use client";
import { useState, type ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { HorizontalTrack } from "./HorizontalTrack";
import { MoodBackground } from "./MoodBackground";
import { WebGLAtmosphere } from "./WebGLAtmosphere";
import { BuildSpine } from "./BuildSpine";
import { ProgressContext } from "./ProgressContext";
import { SideNav } from "@/components/nav/SideNav";

export function Experience({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  return (
    <SmoothScroll>
      <ProgressContext.Provider value={progress}>
        <MoodBackground progress={progress} />
        <WebGLAtmosphere progress={progress} />
        <BuildSpine progress={progress} />
        <HorizontalTrack onProgress={setProgress}>{children}</HorizontalTrack>
        <SideNav />
      </ProgressContext.Provider>
    </SmoothScroll>
  );
}
