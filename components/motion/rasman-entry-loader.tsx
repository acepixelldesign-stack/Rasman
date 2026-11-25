'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOTION_EASE } from '@/lib/motion/system';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';

const SVG_NS = 'http://www.w3.org/2000/svg';
const BAR_MAX_WIDTH = 368;
const LOADER_DURATION_MS = 5000;
const REDUCED_MOTION_DURATION_MS = 500;
const COMPLETION_HOLD_MS = 160;

/** Module-level guard so the 5-second entry loader plays once per site entry, never on internal route changes */
let hasPlayedEntryLoader = false;

interface DrawableStroke {
  readonly el: SVGGeometryElement;
  readonly length: number;
  readonly start: number;
  readonly end: number;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Full-screen 5-second architectural SVG sketch preloader on initial site entry:
 * - Faithfully reproduces the hand-sketched construction lines, seeded cross-hatching,
 *   RASMAN typographic strokes, clipped subtitle reveal, and aligned 0%–100% progress bar.
 * - Theme-aware via semantic tokens (--bg-canvas / --ink-primary / --grid-line).
 * - Dissolves calmly with Rasman silk easing upon completion.
 */
export function RasmanEntryLoader() {
  const [isVisible, setIsVisible] = useState<boolean>(
    () => !hasPlayedEntryLoader
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const outerHatchRef = useRef<SVGGElement>(null);
  const innerHatchRef = useRef<SVGGElement>(null);
  const letterHatchRef = useRef<SVGGElement>(null);
  const subtitleClipRectRef = useRef<SVGRectElement>(null);
  const progressFillRef = useRef<SVGRectElement>(null);
  const progressPercentRef = useRef<SVGTextElement>(null);

  const rawId = useId();
  const idPrefix = rawId.replace(/:/g, '');
  const clipOuterId = `${idPrefix}-clip-outer`;
  const clipInnerId = `${idPrefix}-clip-inner`;
  const clipLettersId = `${idPrefix}-clip-letters`;
  const clipSubtitleId = `${idPrefix}-clip-subtitle`;

  useBodyScrollLock(isVisible);

  useEffect(() => {
    if (!isVisible) return;

    const svg = svgRef.current;
    const outerHatchGroup = outerHatchRef.current;
    const innerHatchGroup = innerHatchRef.current;
    const letterHatchGroup = letterHatchRef.current;
    const subtitleClipRect = subtitleClipRectRef.current;
    const progressFill = progressFillRef.current;
    const progressPercent = progressPercentRef.current;

    if (
      !svg ||
      !outerHatchGroup ||
      !innerHatchGroup ||
      !letterHatchGroup ||
      !subtitleClipRect ||
      !progressFill ||
      !progressPercent
    ) {
      return;
    }

    // Clear any previously appended hatch lines (React StrictMode double-effect safety)
    outerHatchGroup.replaceChildren();
    innerHatchGroup.replaceChildren();
    letterHatchGroup.replaceChildren();

    // Deterministic seeded PRNG for natural architectural hand-drawn cross-hatching
    let seed = 4219;
    const rand = (): number => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const addHatchLine = (
      parent: SVGGElement,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      start: number,
      end: number,
      width = 0.85,
      opacity = 0.82
    ) => {
      const line = document.createElementNS(SVG_NS, 'line');
      const jitter = 1.4;
      line.setAttribute('x1', (x1 + (rand() - 0.5) * jitter).toFixed(1));
      line.setAttribute('y1', (y1 + (rand() - 0.5) * jitter).toFixed(1));
      line.setAttribute('x2', (x2 + (rand() - 0.5) * jitter).toFixed(1));
      line.setAttribute('y2', (y2 + (rand() - 0.5) * jitter).toFixed(1));
      line.setAttribute('fill', 'none');
      line.setAttribute('stroke', 'currentColor');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('stroke-width', width.toFixed(2));
      line.setAttribute('stroke-opacity', opacity.toFixed(2));
      line.dataset.start = start.toFixed(3);
      line.dataset.end = end.toFixed(3);
      parent.appendChild(line);
    };

    // 1) Outer left wall & roof diagonal hatching + upper-left shoulder cross-hatch
    for (let t = 0; t < 44; t += 1) {
      const p = t / 44;
      const yBase = 165 + t * 7.2;
      const s = 0.42 + p * 0.18;
      addHatchLine(
        outerHatchGroup,
        108,
        yBase + 22,
        168,
        yBase - 32,
        s,
        s + 0.08,
        0.85,
        0.82
      );
    }
    for (let t = 0; t < 16; t += 1) {
      const yBase = 158 + t * 6.5;
      const s = 0.48 + (t / 16) * 0.12;
      addHatchLine(
        outerHatchGroup,
        110,
        yBase - 22,
        166,
        yBase + 26,
        s,
        s + 0.08,
        0.72,
        0.65
      );
    }

    // 2) Outer crown & right roof vertical-tilted hatching
    for (let x = 155; x <= 430; x += 6.2) {
      const p = (x - 155) / 275;
      const tilt = x < 283 ? -12 : 11;
      const s = 0.46 + p * 0.22;
      addHatchLine(
        outerHatchGroup,
        x,
        66,
        x + tilt,
        232,
        s,
        s + 0.09,
        0.88,
        0.84
      );
    }

    // 3) Bottom horizontal band + lower-right stem curve cross-hatch
    for (let x = 128; x <= 346; x += 6.8) {
      const p = (x - 128) / 218;
      const s = 0.54 + p * 0.16;
      addHatchLine(
        outerHatchGroup,
        x - 16,
        458,
        x + 22,
        418,
        s,
        s + 0.08,
        0.85,
        0.82
      );
    }
    for (let x = 290; x <= 355; x += 6.2) {
      const p = (x - 290) / 65;
      const s = 0.62 + p * 0.12;
      addHatchLine(
        outerHatchGroup,
        x - 18,
        412,
        x + 24,
        458,
        s,
        s + 0.08,
        0.78,
        0.75
      );
    }

    // 4) Leaf stem, upper veins, lower belly cross-hatch, and mid-right soft veins
    for (let y = 295; y <= 415; y += 6.5) {
      const p = (y - 295) / 120;
      const s = 0.64 + p * 0.14;
      addHatchLine(
        outerHatchGroup,
        330,
        y + 18,
        392,
        y - 28,
        s,
        s + 0.08,
        0.8,
        0.78
      );
      addHatchLine(
        outerHatchGroup,
        330,
        y - 16,
        390,
        y + 20,
        s + 0.04,
        s + 0.12,
        0.72,
        0.68
      );
    }
    for (let x = 390; x <= 476; x += 11) {
      const p = (x - 390) / 86;
      const s = 0.68 + p * 0.12;
      addHatchLine(
        outerHatchGroup,
        x,
        240,
        x - 18,
        305,
        s,
        s + 0.08,
        0.75,
        0.65
      );
    }
    for (let x = 368; x <= 480; x += 6.2) {
      const p = (x - 368) / 112;
      const s = 0.7 + p * 0.14;
      addHatchLine(
        outerHatchGroup,
        x + 4,
        332,
        x - 5,
        400,
        s,
        s + 0.08,
        0.82,
        0.8
      );
    }
    for (let y = 342; y <= 394; y += 6.2) {
      const p = (y - 342) / 52;
      const s = 0.73 + p * 0.12;
      addHatchLine(
        outerHatchGroup,
        362,
        y,
        458,
        y - 6,
        s,
        s + 0.08,
        0.72,
        0.68
      );
    }
    for (let y = 278; y <= 338; y += 14) {
      const p = (y - 278) / 60;
      const s = 0.74 + p * 0.1;
      addHatchLine(
        outerHatchGroup,
        412,
        y,
        480,
        y - 10,
        s,
        s + 0.08,
        0.7,
        0.58
      );
    }

    // 5) Inner house column & roof dense cross-hatching
    for (let y = 248; y <= 392; y += 6.2) {
      const p = (y - 248) / 144;
      const s = 0.5 + p * 0.18;
      addHatchLine(
        innerHatchGroup,
        188,
        y + 18,
        228,
        y - 18,
        s,
        s + 0.08,
        0.85,
        0.85
      );
      addHatchLine(
        innerHatchGroup,
        188,
        y - 18,
        228,
        y + 18,
        s + 0.03,
        s + 0.11,
        0.82,
        0.82
      );
    }
    for (let x = 218; x <= 284; x += 6.8) {
      const p = (x - 218) / 66;
      const s = 0.54 + p * 0.12;
      addHatchLine(
        innerHatchGroup,
        x,
        170,
        x - 4,
        260,
        s,
        s + 0.08,
        0.82,
        0.78
      );
    }
    for (let x = 282; x <= 368; x += 6.2) {
      const p = (x - 282) / 86;
      const s = 0.58 + p * 0.15;
      addHatchLine(
        innerHatchGroup,
        x - 16,
        180,
        x + 22,
        272,
        s,
        s + 0.08,
        0.82,
        0.82
      );
      addHatchLine(
        innerHatchGroup,
        x + 20,
        180,
        x - 20,
        272,
        s + 0.03,
        s + 0.11,
        0.8,
        0.8
      );
    }

    // 6) RASMAN letter interior hatching
    for (let x = 112; x <= 488; x += 4.6) {
      const p = (x - 112) / 376;
      const s = 0.72 + p * 0.18;
      addHatchLine(
        letterHatchGroup,
        x - 10,
        548,
        x + 12,
        500,
        s,
        s + 0.08,
        0.78,
        0.75
      );
    }

    // Prepare every stroke path/line for stroke-dashoffset drawing
    const drawables: DrawableStroke[] = [];
    svg.querySelectorAll<SVGGeometryElement>('[data-start]').forEach((el) => {
      const length = el.getTotalLength();
      el.style.strokeDasharray = `${length}`;
      el.style.strokeDashoffset = `${length}`;
      drawables.push({
        el,
        length,
        start: Number.parseFloat(el.dataset.start ?? '0'),
        end: Number.parseFloat(el.dataset.end ?? '1'),
      });
    });

    const renderProgress = (progress: number) => {
      const p = clamp(progress, 0, 1);

      for (let i = 0; i < drawables.length; i += 1) {
        const item = drawables[i];
        const local = clamp((p - item.start) / (item.end - item.start), 0, 1);
        item.el.style.strokeDashoffset = `${item.length * (1 - easeOutCubic(local))}`;
      }

      const subLocal = clamp((p - 0.82) / 0.18, 0, 1);
      subtitleClipRect.setAttribute(
        'width',
        (376 * easeOutCubic(subLocal)).toFixed(2)
      );

      progressFill.setAttribute('width', (BAR_MAX_WIDTH * p).toFixed(2));
      progressPercent.textContent = `${Math.round(p * 100)}%`;
    };

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const durationMs = prefersReducedMotion
      ? REDUCED_MOTION_DURATION_MS
      : LOADER_DURATION_MS;

    renderProgress(0);
    svg.style.opacity = '1';

    let rafId: number | null = null;
    let holdTimer: number | null = null;
    const startTime = performance.now();

    const step = (now: number) => {
      const raw = clamp((now - startTime) / durationMs, 0, 1);
      const eased = easeInOutQuad(raw);
      renderProgress(eased);

      if (raw < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        renderProgress(1);
        holdTimer = window.setTimeout(() => {
          hasPlayedEntryLoader = true;
          setIsVisible(false);
        }, COMPLETION_HOLD_MS);
      }
    };

    rafId = window.requestAnimationFrame(step);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (holdTimer !== null) {
        window.clearTimeout(holdTimer);
      }
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="rasman-entry-loader"
          role="status"
          aria-live="polite"
          aria-label="RASMAN Architecture & Design"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.015,
            transition: {
              duration: 0.48,
              ease: MOTION_EASE.silk,
            },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[var(--bg-canvas)] text-[var(--ink-primary)]"
        >
          <div
            dir="ltr"
            className="flex w-[min(84vw,400px)] flex-col items-center justify-center select-none"
          >
            <svg
              ref={svgRef}
              viewBox="70 32 456 625"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="RASMAN Architecture & Design"
              style={{ opacity: 0, transition: 'opacity 180ms ease' }}
              className="block h-auto w-full text-[var(--ink-primary)]"
            >
              <defs>
                <clipPath id={clipOuterId}>
                  <path d="M 427 181.1 L 427 220.8 L 310 119.2 C 294 105.5 272 105.5 256 119.2 L 160 202.6 C 148 213.5 144 226 144 244 L 144 390 C 144 412 158 424 180 424 L 292 424 C 322 424 337 404 337 372 C 337 325 358 292 406 270 C 438 255 464 244 481 232 C 486 275 478 326 446 360 C 422 385 394 395 367 394 C 386 354 412 320 445 292 C 406 312 376 344 363 386 C 350 428 332 453 296 453 L 176 453 C 138 453 114 429 114 391 L 114 234 C 114 208 126 190 148 171 L 248 86.4 C 269 68 297 68 318 86.4 Z" />
                </clipPath>

                <clipPath id={clipInnerId}>
                  <path d="M 193 388 L 193 272 C 193 256 198 247 210 237 L 283 174 L 366 246.1 L 347 268 L 283 212.4 L 233 255.8 C 224 264 222 271 222 284 L 222 388 Z" />
                </clipPath>

                <clipPath id={clipLettersId}>
                  <path d="M 114 502 L 120 502 L 120 545 L 114 545 Z" />
                  <path d="M 120 502 L 134 502 C 145 502 150 507.5 150 515 C 150 522 145 527 136 528 L 151 545 L 143.5 545 L 128 528 L 124 528 L 124 523 L 133.5 523 C 141 523 144 519.5 144 515 C 144 510.5 141 507.5 133.5 507.5 L 120 507.5 Z" />
                  <path d="M 175 545 L 196.5 502 L 218 545 L 211.5 545 L 196.5 514 L 181.5 545 Z" />
                  <path d="M 274 508 C 267 501 253 501 247 507 C 242 512 243 519 250 523 C 256 526 266 527 269 532 C 271 536 266 540 260 540 C 254 540 250 537 248 534 L 244 538 C 249 544 255 546 261 546 C 271 546 277 540 276 532 C 275 524 266 521 259 519 C 252 517 249 514 251 511 C 253 507 264 506 270 512 Z" />
                  <path d="M 306 545 L 306 502 L 311.5 502 L 327.5 527.5 L 343.5 502 L 349 502 L 349 545 L 343.5 545 L 343.5 512.5 L 327.5 538 L 311.5 512.5 L 311.5 545 Z" />
                  <path d="M 375 545 L 396.5 502 L 418 545 L 411.5 545 L 396.5 514 L 381.5 545 Z" />
                  <path d="M 446 545 L 446 502 L 451.5 502 L 476.5 535.5 L 476.5 502 L 482 502 L 482 545 L 476.5 545 L 451.5 511.5 L 451.5 545 Z" />
                </clipPath>

                <clipPath id={clipSubtitleId}>
                  <rect
                    ref={subtitleClipRectRef}
                    x="112"
                    y="556"
                    width="0"
                    height="34"
                  />
                </clipPath>
              </defs>

              {/* 1. Architectural Construction Guide Lines */}
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
                strokeLinecap="round"
                opacity="0.78"
              >
                <line data-start="0.00" data-end="0.14" x1="234" y1="98" x2="299" y2="42" />
                <line data-start="0.02" data-end="0.16" x1="332" y1="98" x2="270" y2="44" />
                <line data-start="0.04" data-end="0.18" x1="114" y1="164" x2="114" y2="245" />
                <line data-start="0.05" data-end="0.19" x1="156" y1="165" x2="86" y2="227" />
                <line data-start="0.07" data-end="0.20" x1="427" y1="153" x2="427" y2="243" />
                <line data-start="0.08" data-end="0.20" x1="418" y1="173" x2="454" y2="205" />
                <line data-start="0.09" data-end="0.21" x1="419" y1="214" x2="441" y2="233" />
                <line data-start="0.08" data-end="0.21" x1="261" y1="154" x2="305" y2="193" />
                <line data-start="0.09" data-end="0.22" x1="305" y1="154" x2="261" y2="193" />
                <line data-start="0.10" data-end="0.22" x1="260" y1="192" x2="306" y2="232" />
                <line data-start="0.11" data-end="0.23" x1="306" y1="192" x2="260" y2="232" />
                <line data-start="0.10" data-end="0.22" x1="193" y1="227" x2="193" y2="280" />
                <line data-start="0.11" data-end="0.23" x1="212" y1="235" x2="177" y2="266" />
                <line data-start="0.12" data-end="0.24" x1="176" y1="388" x2="240" y2="388" />
                <line data-start="0.13" data-end="0.24" x1="193" y1="380" x2="193" y2="401" />
                <line data-start="0.13" data-end="0.24" x1="222" y1="380" x2="222" y2="404" />
                <line data-start="0.12" data-end="0.24" x1="378" y1="232" x2="329" y2="281" />
                <line data-start="0.13" data-end="0.24" x1="358" y1="239" x2="382" y2="260" />
                <line data-start="0.14" data-end="0.25" x1="340" y1="262" x2="360" y2="279" />
                <line data-start="0.12" data-end="0.25" x1="88" y1="453" x2="185" y2="453" />
                <line data-start="0.13" data-end="0.25" x1="114" y1="395" x2="114" y2="468" />
                <line data-start="0.14" data-end="0.26" x1="101" y1="406" x2="163" y2="468" />
                <line data-start="0.15" data-end="0.27" x1="286" y1="453" x2="372" y2="453" />
                <line data-start="0.16" data-end="0.27" x1="335" y1="406" x2="335" y2="467" />
                <line data-start="0.16" data-end="0.28" x1="286" y1="470" x2="342" y2="424" />
                <line data-start="0.17" data-end="0.28" x1="474" y1="211" x2="482" y2="245" />
                <line data-start="0.18" data-end="0.29" x1="468" y1="242" x2="486" y2="225" />
                <line data-start="0.18" data-end="0.29" x1="355" y1="393" x2="386" y2="395" />
                <line data-start="0.19" data-end="0.30" x1="373" y1="377" x2="361" y2="415" />
              </g>

              {/* 2. Seeded Hand-Drawn Cross-Hatching Layers */}
              <g ref={outerHatchRef} clipPath={`url(#${clipOuterId})`} />
              <g ref={innerHatchRef} clipPath={`url(#${clipInnerId})`} />

              {/* 3. Main Architectural House & Leaf Outlines */}
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  strokeWidth="2.85"
                  data-start="0.14"
                  data-end="0.50"
                  d="M 427 181.1 L 318 86.4 C 297 68 269 68 248 86.4 L 148 171 C 126 190 114 208 114 234 L 114 391 C 114 429 138 453 176 453 L 296 453 C 332 453 350 428 363 386 C 376 344 406 312 445 292"
                />
                <path
                  strokeWidth="2.85"
                  data-start="0.19"
                  data-end="0.55"
                  d="M 427 181.1 L 427 220.8 L 310 119.2 C 294 105.5 272 105.5 256 119.2 L 160 202.6 C 148 213.5 144 226 144 244 L 144 390 C 144 412 158 424 180 424 L 292 424 C 322 424 337 404 337 372 C 337 325 358 292 406 270 C 438 255 464 244 481 232"
                />
                <path
                  strokeWidth="2.85"
                  data-start="0.38"
                  data-end="0.58"
                  d="M 481 232 C 486 275 478 326 446 360 C 422 385 394 395 367 394 C 386 354 412 320 445 292"
                />
                <path
                  strokeWidth="1.15"
                  opacity="0.75"
                  data-start="0.30"
                  data-end="0.56"
                  d="M 426 184 L 317 89 C 296 71 270 71 249 89 L 150 173 C 129 191 117 209 117 235 L 117 390 C 117 426 140 450 176 450 L 295 450"
                />
                <path
                  strokeWidth="2.85"
                  data-start="0.25"
                  data-end="0.54"
                  d="M 193 388 L 193 272 C 193 256 198 247 210 237 L 283 174 L 366 246.1 L 347 268 L 283 212.4 L 233 255.8 C 224 264 222 271 222 284 L 222 388 Z"
                />
              </g>

              {/* 4. Typography Construction Guide Lines */}
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
                strokeLinecap="round"
                opacity="0.78"
              >
                <line data-start="0.56" data-end="0.68" x1="98" y1="502" x2="154" y2="502" />
                <line data-start="0.57" data-end="0.69" x1="102" y1="545" x2="164" y2="545" />
                <line data-start="0.57" data-end="0.69" x1="114" y1="494" x2="114" y2="556" />
                <line data-start="0.59" data-end="0.70" x1="191" y1="513" x2="201" y2="493" />
                <line data-start="0.59" data-end="0.70" x1="192" y1="493" x2="202" y2="513" />
                <line data-start="0.60" data-end="0.70" x1="170" y1="554" x2="180" y2="536" />
                <line data-start="0.60" data-end="0.70" x1="213" y1="536" x2="222" y2="554" />
                <line data-start="0.62" data-end="0.73" x1="296" y1="502" x2="358" y2="502" />
                <line data-start="0.63" data-end="0.74" x1="296" y1="545" x2="358" y2="545" />
                <line data-start="0.65" data-end="0.76" x1="391" y1="513" x2="401" y2="493" />
                <line data-start="0.65" data-end="0.76" x1="392" y1="493" x2="402" y2="513" />
                <line data-start="0.67" data-end="0.78" x1="437" y1="502" x2="496" y2="502" />
                <line data-start="0.68" data-end="0.79" x1="437" y1="545" x2="495" y2="545" />
                <line data-start="0.68" data-end="0.79" x1="482" y1="492" x2="482" y2="556" />
              </g>

              {/* 5. RASMAN Letter Interior Hatching */}
              <g ref={letterHatchRef} clipPath={`url(#${clipLettersId})`} />

              {/* 6. RASMAN Letter Outlines */}
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  data-start="0.60"
                  data-end="0.74"
                  d="M 114 502 L 120 502 L 120 545 L 114 545 Z"
                />
                <path
                  data-start="0.62"
                  data-end="0.77"
                  d="M 120 502 L 134 502 C 145 502 150 507.5 150 515 C 150 522 145 527 136 528 L 151 545 L 143.5 545 L 128 528 L 124 528 L 124 523 L 133.5 523 C 141 523 144 519.5 144 515 C 144 510.5 141 507.5 133.5 507.5 L 120 507.5 Z"
                />
                <path
                  data-start="0.65"
                  data-end="0.80"
                  d="M 175 545 L 196.5 502 L 218 545 L 211.5 545 L 196.5 514 L 181.5 545 Z"
                />
                <path
                  data-start="0.69"
                  data-end="0.84"
                  d="M 274 508 C 267 501 253 501 247 507 C 242 512 243 519 250 523 C 256 526 266 527 269 532 C 271 536 266 540 260 540 C 254 540 250 537 248 534 L 244 538 C 249 544 255 546 261 546 C 271 546 277 540 276 532 C 275 524 266 521 259 519 C 252 517 249 514 251 511 C 253 507 264 506 270 512 Z"
                />
                <path
                  data-start="0.72"
                  data-end="0.87"
                  d="M 306 545 L 306 502 L 311.5 502 L 327.5 527.5 L 343.5 502 L 349 502 L 349 545 L 343.5 545 L 343.5 512.5 L 327.5 538 L 311.5 512.5 L 311.5 545 Z"
                />
                <path
                  data-start="0.76"
                  data-end="0.90"
                  d="M 375 545 L 396.5 502 L 418 545 L 411.5 545 L 396.5 514 L 381.5 545 Z"
                />
                <path
                  data-start="0.79"
                  data-end="0.93"
                  d="M 446 545 L 446 502 L 451.5 502 L 476.5 535.5 L 476.5 502 L 482 502 L 482 545 L 476.5 545 L 451.5 511.5 L 451.5 545 Z"
                />
              </g>

              {/* 7. Clipped Subtitle Reveal Aligned to Exact Logo Width */}
              <g clipPath={`url(#${clipSubtitleId})`}>
                <text
                  x="114"
                  y="578"
                  textLength="368"
                  lengthAdjust="spacing"
                  fill="currentColor"
                  style={{
                    fontFamily: 'var(--font-latin), system-ui, sans-serif',
                    fontSize: '20.5px',
                    fontWeight: 500,
                  }}
                >
                  ΛRCHITECTURE &amp; DESIGN
                </text>
              </g>

              {/* 8. Logo-Width Progress Track & Percentage */}
              <g>
                <rect
                  x="114"
                  y="608"
                  width={BAR_MAX_WIDTH}
                  height="3.2"
                  fill="var(--grid-line)"
                />
                <rect
                  ref={progressFillRef}
                  x="114"
                  y="608"
                  width="0"
                  height="3.2"
                  fill="currentColor"
                />
                <text
                  ref={progressPercentRef}
                  x="298"
                  y="634"
                  textAnchor="middle"
                  fill="currentColor"
                  style={{
                    fontFamily: 'var(--font-latin), system-ui, sans-serif',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    letterSpacing: '1.4px',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  0%
                </text>
              </g>
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
