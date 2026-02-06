// --- CENTRAL DESIGN TOKENS ---

export const THEME = {
  layout: {
    paddingX: "px-[var(--layout-gutter)]",
    headerPaddingX: "px-[var(--layout-gutter)]",
    paddingY: "py-6 md:py-8",
    barHeight: "h-11 md:h-12",
    fullScreen:
      "fixed inset-0 h-screen supports-[height:100dvh]:h-[100dvh] flex flex-col bg-canvas text-txt-main font-mono select-none overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
    mainContent:
      "flex-1 flex flex-col md:flex-row landscape:flex-row overflow-hidden relative min-h-0 w-full z-10",

    // LAYER 5 (Projector) hitting Layer 1 (Wall)
    textSection: `
            relative flex flex-col bg-transparent z-10 min-h-0 
            border-b border-border md:border-b-0 md:border-r landscape:border-b-0 landscape:border-r
            flex-1 md:flex-none md:w-[var(--desktop-text-width)] landscape:flex-none landscape:w-[var(--desktop-text-width)] md:h-full landscape:h-full
            transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        `,

    // LAYER 2 (Lotus Panel)
    gridSection: `
            relative flex flex-col 
            bg-surface
            w-full md:w-auto landscape:w-auto md:flex-1 landscape:flex-1 md:h-full landscape:h-full
            z-30
            shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.7)] md:shadow-none landscape:shadow-none
            border-t border-border md:border-t-0 landscape:border-t-0
        `,
  },

  // LAYER 5 (HUD) & LAYER 6 (Laser)
  navigation: {
    text: {
      // GEOMETRIC STABILITY:
      // Base and Active MUST share the same weight/tracking to prevent layout jumps.
      // Changes only affect Color, Opacity, and Shadows.
      base: "text-txt-muted group-hover:text-hud transition-colors duration-300 drop-shadow-md",

      // Active adds 'drop-shadow-projector' and changes color to 'text-hud'
      active: "text-hud drop-shadow-projector",

      dim: "text-txt-dim",
    },
    icon: {
      base: "text-txt-muted group-hover:text-txt-main transition-colors duration-300 drop-shadow-md",
      active: "text-accent drop-shadow-laser",
    },
    opacity: {
      inactive: "opacity-80",
      active: "opacity-100",
      faint: "opacity-30",
    },
  },

  panel: {
    scrollableText:
      "flex-1 overflow-y-auto scroll-smooth scrollbar-hide w-full mix-blend-normal [mask-image:linear-gradient(to_bottom,transparent_0%,black_20px,black_92%,transparent_100%)]",
    navigatorSlab: "bg-transparent",
  },

  typography: {
    // --- LEVEL 1: CONTENT HEADER ---
    // Largest size, Brightest White
    h1: "text-xl md:text-2xl font-bold tracking-tight uppercase break-words hyphens-auto leading-[1.1] text-hud drop-shadow-projector",

    // --- LEVEL 2: CONTENT SUBHEADERS ---
    // Medium size, Accent Color
    h2: "text-accent text-xs md:text-sm font-bold mt-12 mb-4 tracking-[0.2em] uppercase break-words select-none drop-shadow-laser",

    h3: "text-txt-dim font-bold mt-8 mb-3 text-[11px] md:text-xs tracking-[0.15em] uppercase break-words",

    // --- LEVEL 3: CONTENT BODY ---
    // Regular size, High Contrast Grey (for readability)
    body: "prose prose-invert prose-p:font-mono prose-p:font-light prose-sm max-w-none text-txt-muted leading-relaxed tracking-normal break-words hyphens-auto prose-a:no-underline prose-blockquote:not-italic prose-blockquote:before:content-none prose-blockquote:after:content-none [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none prose-p:mb-4 prose-ul:my-4 prose-li:my-1 prose-strong:text-hud prose-strong:drop-shadow-projector prose-code:text-txt-muted",

    // --- LEVEL 4: GRID HUD ---
    // Medium-Large size, Bold, Fixed Tracking.
    // Used in Lotus Grid cells. Needs to be readable over images.
    hud: "text-sm md:text-base font-mono uppercase tracking-[0.1em] font-bold leading-none",

    // --- LEVEL 5: TECHNICAL UI ---
    // Small size, Bold, Wide Tracking.
    // Used in HeaderTabs and Breadcrumbs.
    // CRITICAL: Includes 'font-bold' here so it applies to both active and inactive states.
    ui: "text-[10px] md:text-[11px] font-mono uppercase tracking-[0.15em] font-bold leading-none",

    meta: "text-[9px] font-mono uppercase tracking-[0.2em]",

    contentFooter:
      "mt-16 pt-8 border-t border-border-dim w-full select-none transition-opacity flex flex-col",
  },

  interactive: {
    linkInternal:
      "inline-flex items-center gap-1 border-b border-accent/20 text-accent hover:brightness-125 hover:border-accent hover:drop-shadow-laser transition-all pb-px no-underline leading-none",
    linkMedia:
      "group inline-flex items-center justify-center gap-2 px-3 py-1.5 mx-1.5 my-1 text-[9px] font-bold tracking-[0.15em] uppercase text-txt-dim bg-overlay/5 border border-border hover:text-txt-muted hover:border-overlay/20 hover:bg-overlay/10 transition-all rounded-[1px] align-middle select-none whitespace-nowrap backdrop-blur-[1px] leading-none",
  },

  lotus: {
    frame: "flex-1 w-full h-full p-1 bg-transparent",
    gridWrapper: "grid grid-cols-3 grid-rows-3 w-full h-full gap-1",
    cell: "relative w-full h-full border border-transparent transition-all duration-300 flex flex-col items-center justify-center overflow-hidden group",
    cellActive: "z-40 shadow-plate shadow-diode bg-surface border-transparent",
    cellInteractive: "hover:bg-overlay/5 cursor-pointer z-10 hover:z-30",
    cellEmpty:
      "border-transparent bg-transparent flex items-center justify-center",
    scrim:
      "absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-canvas via-canvas/60 to-transparent pointer-events-none",
  },
};
