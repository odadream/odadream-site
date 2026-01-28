
import { CSSProperties } from 'react';

// --- 1. CENTRAL LAYOUT CONFIGURATION ---
export const LAYOUT_VARS: CSSProperties = {
    // Desktop: 38% Text / 62% Visuals
    '--desktop-text-width': '38%', 
    
    // Grid Mobile Height
    '--mobile-grid-height': '49%',
    
    // UNIFIED BAR HEIGHT
    '--bar-height': '2.75rem', 
    
    '--mobile-header-height': '2.75rem',
} as CSSProperties;

export const THEME = {
    layout: {
        // Shared Horizontal Padding
        paddingX: "px-6 md:px-10 lg:px-12",
        
        // Header Specific Padding (Aligns with H1)
        headerPaddingX: "pl-3 pr-6 md:pl-7 md:pr-10 lg:pl-9 lg:pr-12",
        
        // Shared Vertical Padding
        paddingY: "py-6 md:py-8",

        // Helper for bars
        barHeight: "h-[var(--bar-height)] md:h-12",

        // App container
        fullScreen: "fixed inset-0 h-screen supports-[height:100dvh]:h-[100dvh] flex flex-col bg-canvas text-txt-main font-mono select-none overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
        
        // Main content
        mainContent: "flex-1 flex flex-col md:flex-row landscape:flex-row overflow-hidden relative min-h-0 w-full",
        
        // Text Panel
        textSection: `
            relative flex flex-col bg-canvas z-10 min-h-0 
            border-b border-white/10 md:border-b-0 md:border-r landscape:border-b-0 landscape:border-r
            flex-1 md:flex-none md:w-[var(--desktop-text-width)] landscape:flex-none landscape:w-[var(--desktop-text-width)] md:h-full landscape:h-full
            transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        `,
        
        // Grid Panel
        gridSection: `
            relative flex flex-col bg-black
            w-full md:w-auto landscape:w-auto md:flex-1 landscape:flex-1 md:h-full landscape:h-full
            z-20
        `,
    },
    panel: {
        // Scrollable text area using strict padding
        scrollableText: "flex-1 overflow-y-auto scroll-smooth scrollbar-hide w-full",
    },
    typography: {
        // H1
        h1: "text-xl md:text-2xl font-bold tracking-[-0.02em] uppercase break-words hyphens-auto leading-[1.1] text-zinc-100",
        
        // H2: Cyberpunk Neon Style
        h2: "text-accent drop-shadow-neon text-xs md:text-sm font-bold mt-10 mb-4 tracking-[0.2em] uppercase break-words select-none",
        
        // H3
        h3: "text-zinc-400 font-bold mt-8 mb-3 text-[11px] md:text-xs tracking-[0.15em] uppercase break-words",
        
        // Body
        body: "prose prose-invert prose-p:font-mono prose-p:font-light prose-sm max-w-none text-zinc-400 leading-relaxed tracking-normal break-words hyphens-auto",
        
        // UI LABEL
        uiLabel: "text-[10px] md:text-[11px] font-mono uppercase tracking-[0.15em]",

        // MICRO
        micro: "text-[9px] font-mono uppercase tracking-[0.2em]",
        
        // Tags
        tag: "px-2 py-1 text-[9px] uppercase border border-white/10 text-zinc-500 hover:text-zinc-300 hover:border-accent/40 hover:bg-accent/dim transition-all cursor-default tracking-[0.15em] bg-zinc-900/60 backdrop-blur-sm",
        
        // Content Footer
        contentFooter: "mt-12 pt-6 border-t border-white/10 flex justify-between items-center select-none transition-opacity",

        // Section Headers
        sectionHeader: "text-xs md:text-sm font-bold font-mono uppercase tracking-widest",
    },
    interactive: {
        // Links
        linkInternal: "inline-flex items-center gap-1 border-b border-accent/20 text-accent hover:text-white hover:border-accent/60 hover:bg-accent/dim transition-all pb-px",
        
        // Media buttons
        linkMedia: "group inline-flex items-center justify-center gap-2 px-3 py-1.5 mx-1.5 my-1 text-[9px] font-bold tracking-[0.15em] uppercase text-zinc-500 bg-zinc-900/40 border border-zinc-800 hover:text-accent-text hover:border-accent/20 hover:bg-zinc-900/80 transition-all rounded-[2px] align-middle select-none whitespace-nowrap shadow-none",
    },
    lotus: {
        frame: "flex-1 w-full h-full p-1 bg-black",
        gridWrapper: "grid grid-cols-3 grid-rows-3 w-full h-full gap-1", 
        
        cell: "relative w-full h-full border border-transparent transition-all duration-300 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#0a0a0a] to-[#000000] group",
        
        // ACTIVE: z-20 (Higher than static interactive cells)
        cellActive: "z-20 shadow-neon-soft bg-[#050505]",
        
        // INTERACTIVE: z-10 (Lower than center). REMOVED hover:z-30 to prevent blocking center.
        cellInteractive: "hover:bg-zinc-900/30 cursor-pointer z-10",
        cellEmpty: "border-transparent bg-black flex items-center justify-center",
    }
};
