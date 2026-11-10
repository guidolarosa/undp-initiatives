"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";

import { cn } from "@/lib/utils";

interface Experience {
  _key: string;
  content: string;
  author: string;
  role: string;
}

interface ExperiencesProps {
  title: string;
  content: string;
  experiences: Experience[];
}

/** First letter of the first and last word, e.g. "Sandra Pérez" -> "SP". */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0];
  const last = words[words.length - 1][0];
  return (words.length === 1 ? first : first + last).toUpperCase();
}

function ExperienceCard({
  experience,
  fullWidth = false,
}: {
  experience: Experience;
  /** Fills its Splide slide instead of the fixed desktop card width — the
   * slide itself is sized by Splide's `padding` option on mobile. */
  fullWidth?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-92.5 shrink-0 flex-col justify-between rounded-2xl bg-theme-green p-6",
        fullWidth ? "w-full" : "w-72.5 max-w-72.5",
      )}
    >
      <span className="text-8xl absolute">{`“`}</span>
      <p className="whitespace-pre-line text-foreground/80 mt-14">
        {experience.content}
      </p>
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-sm font-semibold">
          {getInitials(experience.author)}
        </span>
        <strong className="font-semibold">
          {experience.author}
          {experience.role && `, ${experience.role}`}
        </strong>
      </div>
    </div>
  );
}

export const Experiences = ({
  title,
  content,
  experiences,
}: ExperiencesProps) => {
  return (
    <div className="w-full py-6 lg:mx-auto lg:w-284 lg:py-12">
      <div className="flex flex-col gap-2 px-6 lg:flex-row lg:gap-4 lg:px-0">
        <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] lg:w-6/12 lg:text-[56px] lg:leading-18">
          {title}
        </h2>
        <p className="text-base text-foreground/80 whitespace-pre-line lg:w-6/12 lg:text-[20px]">
          {content}
        </p>
      </div>

      {/* Mobile: a Splide carousel, one card centered per view with an even
          peek of its neighbor on each side (symmetric `padding`, no
          `autoWidth` — the slide itself is sized to fill the remaining
          track width, so the active card is always fully visible instead
          of being wider than the viewport). */}
      <div className="mt-6 lg:hidden">
        <Splide
          options={{
            type: "slide",
            perPage: 1,
            gap: "1rem",
            padding: { left: "2rem", right: "2rem" },
            arrows: false,
            pagination: false,
          }}
          aria-label={title}
        >
          {experiences.map((experience) => (
            <SplideSlide key={experience._key}>
              <ExperienceCard experience={experience} fullWidth />
            </SplideSlide>
          ))}
        </Splide>
      </div>

      {/* Desktop: unchanged plain row. */}
      <div className="hidden gap-4 mt-12 lg:flex">
        {experiences.map((experience) => (
          <ExperienceCard key={experience._key} experience={experience} />
        ))}
      </div>
    </div>
  );
};
