import { useMemo } from "react";
import { cn } from "@/lib/utils";

type LoaderHelixProps = {
  dots?: number;
  speed?: number;
  variant?: "dna" | "ribbon" | "minimal";
  dotColor?: string;
  rungColor?: string;
  className?: string;
};

/**
 * Animated DNA helix of dots. Used only as a decorative background in ExploreBioCards.
 * Its keyframes (helix-strand-a, helix-rung-fade, helix-ribbon-gradient) live in index.css.
 */
export function LoaderHelix({
  dots = 12,
  speed = 2,
  variant = "dna",
  dotColor,
  rungColor,
  className,
}: LoaderHelixProps) {
  const maxDisplacement = 12;
  const dotSpacing = 6;
  const containerHeight = dots * dotSpacing;

  const dotPairs = useMemo(() => {
    return Array.from({ length: dots }, (_, i) => ({
      index: i,
      delayA: (i / dots) * speed,
      delayB: (i / dots) * speed + speed / 2,
    }));
  }, [dots, speed]);

  /* Resolve dot/rung colors – fallback to Tailwind's bg-foreground */
  const dotColorClass = dotColor ? "" : "bg-foreground";
  const dotColorStyle = dotColor ? { backgroundColor: dotColor } : {};
  const rungColorResolved = rungColor || (dotColor ? `${dotColor}33` : undefined);
  const rungColorClass = rungColorResolved ? "" : "bg-foreground/20";
  const rungColorStyle = rungColorResolved ? { backgroundColor: rungColorResolved } : {};

  return (
    <output
      data-slot="loader-helix"
      aria-live="polite"
      aria-label="Loading"
      className={cn("relative inline-flex flex-col items-center", className)}
      style={{
        width: 80,
        height: containerHeight,
        gap: dotSpacing,
      }}
    >
      <span className="sr-only">Loading</span>

      {variant === "ribbon" ? (
        <div className="relative w-full h-full flex flex-col justify-around items-center">
          {dotPairs.map((pair) => {
            const gradientOpacity = 0.3 + (pair.index / dots) * 0.7;
            return (
              <div
                key={pair.index}
                className={cn(
                  "absolute left-1/2 rounded-full will-change-transform",
                  dotColorClass
                )}
                style={{
                  width: 5,
                  height: 5,
                  top: pair.index * dotSpacing,
                  animation: `helix-ribbon-gradient ${speed}s ease-in-out infinite`,
                  animationDelay: `${pair.delayA}s`,
                  opacity: gradientOpacity,
                  ...dotColorStyle,
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col justify-around">
          {dotPairs.map((pair) => (
            <div
              key={pair.index}
              className="relative w-full flex items-center justify-center"
              style={{ height: dotSpacing }}
            >
              <div
                className={cn(
                  "absolute rounded-full will-change-transform",
                  dotColorClass
                )}
                style={{
                  width: 5,
                  height: 5,
                  left: "calc(50% - 12px)",
                  animation: `helix-strand-a ${speed}s ease-in-out infinite`,
                  animationDelay: `${pair.delayA}s`,
                  ...dotColorStyle,
                }}
              />

              <div
                className={cn(
                  "absolute rounded-full will-change-transform",
                  dotColorClass
                )}
                style={{
                  width: 5,
                  height: 5,
                  left: "calc(50% - 12px)",
                  animation: `helix-strand-a ${speed}s ease-in-out infinite`,
                  animationDelay: `${pair.delayB}s`,
                  ...dotColorStyle,
                }}
              />

              {variant === "dna" && (
                <span
                  className={cn(
                    "absolute h-px will-change-transform",
                    rungColorClass
                  )}
                  style={{
                    width: maxDisplacement * 2,
                    animation: `helix-rung-fade ${speed}s ease-in-out infinite`,
                    animationDelay: `${pair.delayA}s`,
                    ...rungColorStyle,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </output>
  );
}
