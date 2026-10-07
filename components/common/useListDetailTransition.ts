"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export type SlideDirection = "forward" | "backward";

// How far the content slides, and how long each half of the transition
// takes. Exit is quicker than enter so the swap feels snappy rather than
// sluggish, while the entrance still has room to ease out nicely.
const SLIDE_DISTANCE = -32;
const EXIT_DURATION = 0.2;
const ENTER_DURATION = 0.32;

/**
 * List <-> detail transition: selecting an item slides/fades the new
 * content in from the left ("forward"); going back does the mirror image,
 * sliding/fading the previous content back in from the right ("backward").
 *
 * React swaps the DOM instantly on state change, so the *exit* half can't
 * be a plain CSS transition — it has to actually run (and finish) before
 * the state change that would unmount it. That's what `transition()` is
 * for: it runs the exit tween, then calls `commit` (your state update) in
 * its `onComplete`, then — once the new content has actually rendered —
 * the enter tween keyed on `viewKey` picks up and animates it in.
 *
 * Scrolling lives on a separate wrapper (`scrollRef`) from the animated
 * content (`contentRef`), so animating the content's transform never fights
 * with `overflow-y-auto`.
 */
export function useListDetailTransition(viewKey: string) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const pendingEnterDirectionRef = useRef<SlideDirection | null>(null);

  useLayoutEffect(() => {
    const direction = pendingEnterDirectionRef.current;
    const el = contentRef.current;
    if (!direction || !el) return;
    pendingEnterDirectionRef.current = null;

    tweenRef.current?.kill();
    tweenRef.current = gsap.fromTo(
      el,
      { opacity: 0, x: direction === "forward" ? -SLIDE_DISTANCE : SLIDE_DISTANCE },
      { opacity: 1, x: 0, duration: ENTER_DURATION, ease: "power2.out" },
    );

    return () => {
      tweenRef.current?.kill();
    };
  }, [viewKey]);

  function transition(direction: SlideDirection, commit: () => void) {
    const el = contentRef.current;
    if (!el) {
      commit();
      return;
    }
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(el, {
      opacity: 0,
      x: direction === "forward" ? SLIDE_DISTANCE : -SLIDE_DISTANCE,
      duration: EXIT_DURATION,
      ease: "power1.in",
      onComplete: () => {
        scrollRef.current?.scrollTo({ top: 0 });
        pendingEnterDirectionRef.current = direction;
        commit();
      },
    });
  }

  return { scrollRef, contentRef, transition };
}
