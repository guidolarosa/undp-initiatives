/**
 * @splidejs/react-splide ships real types, but its package.json `exports`
 * map has no "types" condition — under `moduleResolution: "bundler"`,
 * TypeScript can't resolve them (and the nested `@splidejs/splide` the real
 * .d.ts re-exports from isn't hoisted under pnpm's strict node_modules
 * either). This is a minimal, practical shim covering the two components
 * actually used here (`Splide`, `SplideSlide`) rather than fighting that
 * resolution — `skipLibCheck` is already on project-wide, so this is
 * consistent with how loosely declaration files are treated here.
 */
declare module "@splidejs/react-splide" {
  import type { ComponentType, ReactNode, HTMLAttributes } from "react";

  export interface SplideOptions {
    [key: string]: unknown;
  }

  export interface SplideProps extends HTMLAttributes<HTMLDivElement> {
    options?: SplideOptions;
    children?: ReactNode;
  }

  export interface SplideSlideProps extends HTMLAttributes<HTMLLIElement> {
    children?: ReactNode;
  }

  export const Splide: ComponentType<SplideProps>;
  export const SplideSlide: ComponentType<SplideSlideProps>;
}
