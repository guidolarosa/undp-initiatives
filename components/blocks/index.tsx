import type { ComponentType } from "react";

import type {
  BannerSection,
  HeroSection,
  PageSection,
} from "@/lib/sanity/queries";

import { HeroBlock } from "./Hero";
import { BannerBlock } from "./Banner";

/**
 * Registry: maps a Sanity block `_type` to the component that renders it.
 * To add a block: create its schema (sanity/schemaTypes/objects/), register it
 * in PageData.sections, add its component, and add one entry below. No changes
 * to the page route are needed.
 */
type BlockRegistry = {
  hero: ComponentType<{ block: HeroSection }>;
  banner: ComponentType<{ block: BannerSection }>;
};

const registry: BlockRegistry = {
  hero: HeroBlock,
  banner: BannerBlock,
};

export function Blocks({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section) => {
        const Component = registry[section._type as keyof BlockRegistry] as
          ComponentType<{ block: PageSection }> | undefined;
        return Component ? (
          <Component key={section._key} block={section} />
        ) : null;
      })}
    </>
  );
}
