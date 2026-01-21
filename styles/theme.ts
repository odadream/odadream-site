// Centralized Design System Classes

export const THEME = {
    layout: {
        // App container: Force full viewport height, disable window scroll
        fullScreen: "flex flex-col h-[100dvh] w-screen bg-canvas text-txt-main overflow-hidden font-mono select-none",
        
        // Main content area: Splits into Text (top/left) and Grid (bottom/right)
        mainContent: "flex-1 flex flex-col landscape:flex-row overflow-hidden relative min-h-0",
        
        // Text Panel Area
        textSection: "relative w-full landscape:w-[45%] h-1/2 landscape:h-full flex flex-col border-b landscape:border-b-0 landscape:border-r border-white/5 bg-canvas z-10",
        
        // Grid Panel Area
        gridSection: "relative w-full landscape:w-[55%] h-1/2 landscape:h-full flex items-center justify-center bg-black/40 p-4 lg:p-8",
    },
    panel: {
        // The scrollable area inside the text section
        // Removed 'scrollbar-hide' so the custom minimal scrollbar defined in CSS is visible
        scrollableText: "flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 scroll-smooth",
    },
    typography: {
        h1: "text-xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-white uppercase break-words leading-none mb-4",
        h2: "text-accent-text font-bold mt-8 mb-3 text-sm md:text-base tracking-wide uppercase",
        body: "prose prose-invert prose-p:font-mono prose-sm max-w-none text-txt-muted leading-relaxed opacity-90",
        meta: "text-[9px] text-white/20 font-mono absolute top-4 right-4 tracking-widest",
        tag: "px-2 py-1 text-[9px] uppercase border border-white/10 text-txt-dim hover:text-white transition-colors cursor-default",
    },
    interactive: {
        // Links inside text
        linkInternal: "inline-flex items-center gap-1 border-b border-accent/30 text-accent-text hover:text-white hover:border-accent transition-colors pb-0.5 mx-1",
        linkMedia: "inline-flex items-center gap-1.5 px-2 py-1 mx-1 text-xs bg-surface border border-white/5 hover:border-accent/50 hover:bg-surfaceHighlight rounded text-accent-text transition-all",
        
        // Footer navigation buttons
        navButton: "px-3 py-2 text-[10px] md:text-xs font-mono uppercase tracking-wider transition-all duration-300 border-t-2",
        navButtonActive: "border-accent text-accent-text bg-accent/5",
        navButtonInactive: "border-transparent text-txt-dim hover:text-txt-main hover:bg-white/5",
    },
    lotus: {
        // The Grid Container (defines the lines via gap)
        gridWrapper: "grid grid-cols-3 gap-px bg-white/5 border border-white/5", 
        
        // Individual Cells
        cell: "relative w-full h-full bg-canvas transition-colors duration-300 flex flex-col items-center justify-center overflow-hidden",
        cellActive: "bg-surfaceHighlight z-10", // The center cell
        cellInteractive: "hover:bg-surfaceHighlight cursor-pointer group", // Clickable cells
        cellEmpty: "bg-canvas/50", // Empty slots
    }
};