import React from "react";
import { AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Layers, ChevronUp } from "lucide-react";
import { THEME } from "../styles/theme";
import { CyberText } from "./CyberText";
import { MotionDiv } from "../styles/animations";

const cn = (...inputs: (string | undefined | null | false)[]) =>
  twMerge(clsx(inputs));

interface LotusSidebarProps {
  lang: "en" | "ru";
  isDesktop: boolean;
  isGridCollapsed: boolean;
  toggleGrid: (collapsed: boolean) => void;
  navigatorHighlight: boolean;
  /** Ref attached to the draggable handle div — LotusGrid binds native pointer events here */
  handleRef: React.RefObject<HTMLDivElement>;
  /** When true: pulse the handle bar to attract attention after peek animation */
  handlePulse?: boolean;
}

export const LotusSidebar: React.FC<LotusSidebarProps> = ({
  lang,
  isDesktop,
  isGridCollapsed,
  toggleGrid,
  navigatorHighlight,
  handleRef,
  handlePulse,
}) => {
  const layoutKey = isDesktop ? "desktop" : "mobile";

  return (
    <div
      ref={handleRef}
      className={cn(
        "relative flex-shrink-0 z-30 select-none overflow-hidden group transition-colors duration-300",
        THEME.panel.navigatorSlab,
        THEME.layout.barHeight,
        "w-full cursor-pointer px-[var(--layout-gutter)]",
        "md:h-full md:w-[var(--layout-gutter)] md:py-8 md:border-b-0 md:px-0 md:cursor-default md:bg-canvas md:shadow-none",
        "landscape:h-full landscape:w-[var(--layout-gutter)] landscape:py-8 landscape:border-b-0 landscape:px-0 landscape:cursor-default landscape:bg-canvas",
      )}
      style={{ touchAction: "none" }}
    >
      <AnimatePresence mode="wait">
        <MotionDiv
          key={layoutKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "w-full h-full flex items-center justify-between",
            "md:flex-col md:justify-center",
            "landscape:flex-col landscape:justify-center",
          )}
        >
          <div
            className={cn(
              "text-xs md:text-sm font-bold font-mono uppercase tracking-widest flex items-center gap-3 relative z-20",
              "md:[writing-mode:vertical-rl] md:rotate-180 md:justify-center md:flex-1",
              "landscape:[writing-mode:vertical-rl] landscape:rotate-180 landscape:justify-center landscape:flex-1",
              "mix-blend-screen",
            )}
          >
            <span
              className={cn(
                "transition-all duration-500",
                "md:rotate-90 landscape:rotate-90",
                navigatorHighlight
                  ? "text-accent drop-shadow-laser scale-110"
                  : "text-accent drop-shadow-none scale-100",
              )}
            >
              <Layers className="w-4 h-4" />
            </span>
            <span
              className={cn(
                "tracking-[0.35em] transition-all duration-500",
                navigatorHighlight
                  ? THEME.navigation.text.active
                  : THEME.navigation.text.base,
              )}
            >
              <CyberText
                text={lang === "ru" ? "НАВИГАТОР" : "NAVIGATOR"}
                triggerKey={navigatorHighlight ? Date.now() : "static"}
              />
            </span>
          </div>

          {!isDesktop && (
            <div
              className={cn(
                "md:hidden landscape:hidden flex items-center justify-center w-8 h-8 rounded-full active:bg-white/5 transition-colors relative z-20",
                handlePulse && isGridCollapsed
                  ? "text-accent"
                  : "text-zinc-500",
              )}
            >
              <ChevronUp
                className={cn(
                  "w-4 h-4 transition-all duration-500",
                  // Points up when closed (invite to open),
                  // flips to point down when open (invite to close)
                  isGridCollapsed ? "rotate-0" : "rotate-180",
                  isGridCollapsed && handlePulse
                    ? "opacity-100 drop-shadow-[0_0_6px_rgb(var(--color-accent))]"
                    : "opacity-50",
                )}
                style={
                  isGridCollapsed && handlePulse
                    ? {
                        animation:
                          "lotus-handle-pulse 1.8s ease-in-out infinite",
                      }
                    : undefined
                }
              />
            </div>
          )}
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
};
