"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Card grid: whenever `dep` changes (the focus-area filter, in practice),
 * the grid's current children stagger in — each one fading/rising in
 * slightly after the last.
 */
export function useCardStagger(dep: string | undefined) {
  const gridRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || grid.children.length === 0) return;

    tweenRef.current?.kill();
    tweenRef.current = gsap.fromTo(
      grid.children,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" },
    );

    return () => {
      tweenRef.current?.kill();
    };
  }, [dep]);

  return gridRef;
}
