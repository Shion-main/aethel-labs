"use client";
import { useEffect, useRef } from "react";
import { paletteAt } from "@/lib/interpolate";
import styles from "./WebGLAtmosphere.module.css";

/** "#0a1a2f" -> [r,g,b] in 0..1 */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Flowing, domain-warped fbm field tinted with the mood palette, a soft drifting
// ember bloom, and a whisper of film grain. The richer cousin of the CSS radial.
const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec3 uCore;
uniform vec3 uEdge;
uniform float uGlowX;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0,0.0)), c = hash(i + vec2(0.0,1.0)), d = hash(i + vec2(1.0,1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}
void main(){
  float agg = uRes.x / uRes.y;
  vec2 p = vUv * vec2(agg, 1.0) * 1.6;
  float t = uTime * 0.025;

  // domain warp for organic, slow flow
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
  float f = fbm(p + 1.7 * q + t * 0.6);

  // soft ember bloom drifting across with scroll (uGlowX)
  vec2 gp = vec2(uGlowX * agg, 0.5);
  float d = distance(vUv * vec2(agg, 1.0), gp);
  float glow = smoothstep(1.15, 0.0, d);

  // bias toward the edge (ink/paper-deep) so the core (ember) reads as a bloom,
  // not a wash — depth + restraint, per the "ember never a large flat fill" rule.
  float m = pow(clamp(f * 0.58 + glow * 0.5, 0.0, 1.0), 1.35);
  vec3 col = mix(uEdge, uCore, m);

  // gentle vignette toward the edges
  float vig = smoothstep(1.25, 0.25, distance(vUv, vec2(0.5)));
  col *= mix(0.82, 1.0, vig);

  // film grain
  float gr = (hash(vUv * uRes + uTime) - 0.5) * 0.03;
  col += gr;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function WebGLAtmosphere({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Progressive enhancement gate: only the capable, motion-allowed, desktop case.
    const capable = window.matchMedia(
      "(min-width: 821px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    ).matches;
    if (!capable) return; // MoodBackground (CSS) remains the background

    const gl = (canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uCore = gl.getUniformLocation(prog, "uCore");
    const uEdge = gl.getUniformLocation(prog, "uEdge");
    const uGlowX = gl.getUniformLocation(prog, "uGlowX");

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const RENDER_SCALE = 0.7; // the fbm is cheap-ish but render below native for headroom
    const resize = () => {
      const w = Math.max(1, Math.floor(window.innerWidth * DPR * RENDER_SCALE));
      const h = Math.max(1, Math.floor(window.innerHeight * DPR * RENDER_SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let raf = 0;
    let running = true;
    const start = performance.now();
    const render = (now: number) => {
      if (!running) return;
      const p = progressRef.current;
      const pal = paletteAt(p);
      const core = hexToRgb(pal.core);
      const edge = hexToRgb(pal.edge);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform3f(uCore, core[0], core[1], core[2]);
      gl.uniform3f(uEdge, edge[0], edge[1], edge[2]);
      gl.uniform1f(uGlowX, 0.2 + p * 0.6);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />;
}
