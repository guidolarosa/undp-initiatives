import type { ComponentType } from "react";

import type {
  BannerSection,
  FocusAreasListSection,
  HeroSection,
  LowerLinksSection,
  PageSection,
  CTABannerSection,
  PortfolioApproachSection,
} from "@/lib/sanity/queries";

import { HeroBlock } from "./Hero";
import { BannerBlock } from "./Banner";
import { FocusAreasListBlock } from "./FocusAreasList";
import { LowerLinksBlock } from "./LowerLinks";
import { CTABannerBlock } from "./CTABanner";
import { PortfolioApproachBlock } from "./PortfolioApproach";

/**
 * Registry: maps a Sanity block `_type` to the component that renders it.
 * To add a block: create its schema (sanity/schemaTypes/objects/), register it
 * in PageData.sections, add its component, and add one entry below. No changes
 * to the page route are needed.
 */
type BlockRegistry = {
  hero: ComponentType<{ block: HeroSection }>;
  banner: ComponentType<{ block: BannerSection }>;
  focusAreasList: ComponentType<{ block: FocusAreasListSection }>;
  lowerLinks: ComponentType<{ block: LowerLinksSection }>;
  ctaBanner: ComponentType<{ block: CTABannerSection }>;
  portfolioApproach: ComponentType<{ block: PortfolioApproachSection }>;
};

const registry: BlockRegistry = {
  hero: HeroBlock,
  banner: BannerBlock,
  focusAreasList: FocusAreasListBlock,
  lowerLinks: LowerLinksBlock,
  ctaBanner: CTABannerBlock,
  portfolioApproach: PortfolioApproachBlock,
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
