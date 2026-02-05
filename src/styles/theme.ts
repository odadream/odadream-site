
// --- CENTRAL DESIGN TOKENS ---
// We keep class compositions here to keep JSX clean.
// Primitive values (colors, fonts) are in tailwind.config.js

export const THEME = {
    layout: {
        // Shared Horizontal Padding - Unified to 20px (mobile) / 48px (desktop)
        // CRITICAL: Increased from px-10 to px-12 (48px).
        // This matches the w-12 sidebar width, ensuring the text margin on the right
        // equals the sidebar width on the left of the grid.
        paddingX: "px-5 md:px-12",
        
        // Header Specific Padding - Must MATCH paddingX for vertical alignment of text start
        headerPaddingX: "px-5 md:px-12",
        
        // Shared Vertical Padding - Unified to 24px (mobile) / 32px (desktop)
        paddingY: "py-6 md:py-8",

        // Helper for bars - Fixed to 44px (mobile) / 48px (desktop)
        // This constant syncs the Header Height, Sidebar Width, and Breadcrumbs Height.
        barHeight: "h-11 md:h-12",

        // App container
        fullScreen: "fixed inset-0 h-screen supports-[height:100dvh]:h-[100dvh] flex flex-col bg-transparent text-txt-main font-mono select-none overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
        
        // Main content
        mainContent: "flex-1 flex flex-col md:flex-row landscape:flex-row overflow-hidden relative min-h-0 w-full z-10",
        
        // Text Panel
        textSection: `
            relative flex flex-col bg-transparent z-10 min-h-0 
            border-b border-white/5 md:border-b-0 md:border-r landscape:border-b-0 landscape:border-r
            flex-1 md:flex-none md:w-[var(--desktop-text-width)] landscape:flex-none landscape:w-[var(--desktop-text-width)] md:h-full landscape:h-full
            transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        `,
        
        // Grid Panel (The Slab on Mobile)
        // SHADOW CONTROLS:
        // 1. 0_-1px_0_0_rgba(255,255,255,0.05) -> Top Highlight (creates the edge)
        // 2. 0_-16px_48px_-4px_rgba(0,0,0,0.4) -> Softened Shadow (lighter & blurrier)
        // Reduced opacity from 0.8 to 0.4 and increased blur for atmospheric fade.
        gridSection: `
            relative flex flex-col 
            bg-[#131211] shadow-[0_-1px_0_0_rgba(255,255,255,0.05),0_-16px_48px_-4px_rgba(0,0,0,0.4)]
            md:bg-transparent md:shadow-none
            landscape:bg-transparent landscape:shadow-none
            w-full md:w-auto landscape:w-auto md:flex-1 landscape:flex-1 md:h-full landscape:h-full
            z-30
        `,
    },
    panel: {
        // Scrollable text area using strict padding
        scrollableText: "flex-1 overflow-y-auto scroll-smooth scrollbar-hide w-full mix-blend-screen [mask-image:linear_gradient(to_bottom,black_calc(100%-2rem),transparent_100%)]",
        
        // The Navigator "Slab" Handle (Visual Top Edge)
        navigatorSlab: "bg-transparent border-t border-white/5 md:shadow-none md:border-t-0 md:bg-transparent",
    },
    typography: {
        // H1 - Projector Main Beam (Retained distinct)
        h1: "text-xl md:text-2xl font-bold tracking-[-0.02em] uppercase break-words hyphens-auto leading-[1.1] text-zinc-100 drop-shadow-projector",
        
        // H2 - Section Headers (Unified old h2 & sectionHeader)
        // Snapped to grid: mt-12 (48px), mb-4 (16px)
        h2: "text-accent/90 text-xs md:text-sm font-bold mt-12 mb-4 tracking-[0.2em] uppercase break-words select-none",
        
        // H3 - Subheaders (Unified old h3)
        // Snapped to grid: mt-8 (32px), mb-3 (12px)
        h3: "text-zinc-500 font-bold mt-8 mb-3 text-[11px] md:text-xs tracking-[0.15em] uppercase break-words",
        
        // Body - Standard Projection (Reduced glow, lighter hover)
        // prose-a: handled in interactive.linkInternal
        // ADDED: [&_blockquote_p]:before:content-none to kill auto-quotes
        body: "prose prose-invert prose-p:font-mono prose-p:font-light prose-sm max-w-none text-zinc-400 leading-relaxed tracking-normal break-words hyphens-auto prose-a:no-underline prose-blockquote:not-italic prose-blockquote:before:content-none prose-blockquote:after:content-none [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none prose-p:mb-4 prose-ul:my-4 prose-li:my-1",
        
        // UI - Primary Interface Labels (Tabs, Grid, etc.) 
        ui: "text-[10px] md:text-[11px] font-mono uppercase tracking-[0.15em]",

        // Meta - Secondary Data (Tags, Footer, Version)
        meta: "text-[9px] font-mono uppercase tracking-[0.2em]",
        
        // Content Footer
        contentFooter: "mt-16 pt-8 border-t border-white/5 w-full select-none transition-opacity flex flex-col",
    },
    interactive: {
        // Links - Hover is now brighter version of base, not white.
        // Added leading-none to fix icon alignment
        linkInternal: "inline-flex items-center gap-1 border-b border-accent/20 text-accent hover:brightness-125 hover:border-accent hover:drop-shadow-laser transition-all pb-px no-underline leading-none",
        
        // Media buttons
        // Added leading-none to fix icon alignment
        linkMedia: "group inline-flex items-center justify-center gap-2 px-3 py-1.5 mx-1.5 my-1 text-[9px] font-bold tracking-[0.15em] uppercase text-zinc-500 bg-white/5 border border-white/5 hover:text-zinc-300 hover:border-white/20 hover:bg-white/10 transition-all rounded-[1px] align-middle select-none whitespace-nowrap backdrop-blur-[1px] leading-none",
    },
    lotus: {
        frame: "flex-1 w-full h-full p-1 bg-transparent", 
        gridWrapper: "grid grid-cols-3 grid-rows-3 w-full h-full gap-1", 
        
        // CELL
        cell: "relative w-full h-full border border-transparent transition-all duration-300 flex flex-col items-center justify-center overflow-hidden group",
        
        // ACTIVE CELL (Layer 2)
        cellActive: "z-40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.8)] bg-[#161514] border-transparent",
        
        // INTERACTIVE
        cellInteractive: "hover:bg-white/5 cursor-pointer z-10 hover:z-30",
        
        // EMPTY
        cellEmpty: "border-transparent bg-transparent flex items-center justify-center",
    }
};
