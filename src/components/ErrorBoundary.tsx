import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Copy, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

// Collect comprehensive diagnostic data
const getDiagnostics = (error: Error | null, errorInfo: ErrorInfo | null) => {
  const nav = navigator as any;
  
  return {
    // Error details
    error: {
      message: error?.message || "Unknown",
      name: error?.name || "Error",
      stack: error?.stack || "No stack trace",
    },
    
    // Component stack
    componentStack: errorInfo?.componentStack || "No component stack",
    
    // Browser info
    browser: {
      userAgent: nav.userAgent,
      platform: nav.platform,
      language: nav.language,
      cookieEnabled: nav.cookieEnabled,
      onLine: nav.onLine,
      hardwareConcurrency: nav.hardwareConcurrency,
      deviceMemory: nav.deviceMemory || "Unknown",
      maxTouchPoints: nav.maxTouchPoints || 0,
    },
    
    // Screen info
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      orientation: (window.screen.orientation?.type) || "Unknown",
    },
    
    // Window info
    window: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    },
    
    // Performance
    performance: {
      memory: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      } : "Not available",
      timing: performance.timing ? {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      } : "Not available",
    },
    
    // Feature detection
    features: {
      serviceWorker: 'serviceWorker' in navigator,
      geolocation: 'geolocation' in navigator,
      localStorage: (() => {
        try {
          return typeof localStorage !== 'undefined';
        } catch {
          return false;
        }
      })(),
      indexedDB: 'indexedDB' in window,
      webGL: (() => {
        try {
          const canvas = document.createElement('canvas');
          return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch {
          return false;
        }
      })(),
      webGL2: (() => {
        try {
          const canvas = document.createElement('canvas');
          return !!canvas.getContext('webgl2');
        } catch {
          return false;
        }
      })(),
      touchEvents: 'ontouchstart' in window,
      pointerEvents: 'PointerEvent' in window,
    },
    
    // Timestamp
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };
};

// Format diagnostics as copyable text
const formatDiagnostics = (diagnostics: ReturnType<typeof getDiagnostics>) => {
  return `=== ODA.DREAM SYSTEM DIAGNOSTICS ===
Timestamp: ${diagnostics.timestamp}
URL: ${diagnostics.url}

--- ERROR ---
Type: ${diagnostics.error.name}
Message: ${diagnostics.error.message}

Stack Trace:
${diagnostics.error.stack}

Component Stack:
${diagnostics.componentStack}

--- BROWSER ---
User Agent: ${diagnostics.browser.userAgent}
Platform: ${diagnostics.browser.platform}
Language: ${diagnostics.browser.language}
Online: ${diagnostics.browser.onLine}
Cookies: ${diagnostics.browser.cookieEnabled}
CPU Cores: ${diagnostics.browser.hardwareConcurrency}
Device Memory: ${diagnostics.browser.deviceMemory} GB
Max Touch Points: ${diagnostics.browser.maxTouchPoints}

--- SCREEN ---
Resolution: ${diagnostics.screen.width}x${diagnostics.screen.height}
Available: ${diagnostics.screen.availWidth}x${diagnostics.screen.availHeight}
Color Depth: ${diagnostics.screen.colorDepth} bit
Pixel Ratio: ${diagnostics.screen.pixelRatio}
Orientation: ${diagnostics.screen.orientation}

--- VIEWPORT ---
Inner: ${diagnostics.window.innerWidth}x${diagnostics.window.innerHeight}
Outer: ${diagnostics.window.outerWidth}x${diagnostics.window.outerHeight}
Scroll: ${diagnostics.window.scrollX}, ${diagnostics.window.scrollY}

--- PERFORMANCE ---
Memory: ${JSON.stringify(diagnostics.performance.memory, null, 2)}
Timing: ${JSON.stringify(diagnostics.performance.timing, null, 2)}

--- FEATURES ---
Service Worker: ${diagnostics.features.serviceWorker}
Geolocation: ${diagnostics.features.geolocation}
LocalStorage: ${diagnostics.features.localStorage}
IndexedDB: ${diagnostics.features.indexedDB}
WebGL: ${diagnostics.features.webGL}
WebGL2: ${diagnostics.features.webGL2}
Touch Events: ${diagnostics.features.touchEvents}
Pointer Events: ${diagnostics.features.pointerEvents}

=== END DIAGNOSTICS ===`;
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  private copyDiagnostics = async () => {
    const diagnostics = getDiagnostics(this.state.error, this.state.errorInfo);
    const text = formatDiagnostics(diagnostics);
    
    try {
      await navigator.clipboard.writeText(text);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }
  };

  public render() {
    if (this.state.hasError) {
      const diagnostics = getDiagnostics(this.state.error, this.state.errorInfo);
      
      // Parse browser info
      const ua = diagnostics.browser.userAgent;
      const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
      const isIOS = /iPhone|iPad|iPod/i.test(ua);
      const iosVersion = isIOS ? ua.match(/OS (\d+)_(\d+)_?(\d+)?/)?.[1] : null;
      const safariVersion = ua.match(/Version\/(\d+\.\d+)/)?.[1];
      
      return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center p-4 text-red-500 font-mono overflow-y-auto overflow-x-hidden">
          <div className="max-w-2xl w-full border border-red-500/30 bg-red-950/10 p-4 sm:p-6 rounded-sm backdrop-blur-md relative my-auto">
            {/* Top laser line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />

            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle
                className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse flex-shrink-0"
                strokeWidth={1.5}
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-xl font-bold tracking-widest uppercase">
                  System Failure
                </h1>
                <span className="text-[10px] sm:text-xs opacity-70">
                  Critical Runtime Exception
                </span>
              </div>
              {isMobile && (
                <div className="text-[10px] sm:text-xs text-right opacity-70 flex-shrink-0">
                  <div>{isIOS ? 'iOS' : 'Mobile'} {iosVersion || ''}</div>
                  {safariVersion && <div>Safari {safariVersion}</div>}
                </div>
              )}
            </div>

            {/* Error message */}
            <div className="bg-black/50 p-3 sm:p-4 rounded mb-3 border border-red-500/10 max-h-32 overflow-y-auto">
              <div className="text-[10px] sm:text-xs opacity-50 mb-1">ERROR.TYPE</div>
              <code className="text-xs sm:text-sm break-all opacity-90 block">
                {this.state.error?.name || "UnknownError"}
              </code>
              <div className="text-[10px] sm:text-xs opacity-50 mt-2 sm:mt-3 mb-1">ERROR.MESSAGE</div>
              <code className="text-[10px] sm:text-xs break-all opacity-80 block">
                {this.state.error?.message || "Unknown Error"}
              </code>
            </div>

            {/* Quick diagnostics */}
            <div className="bg-black/30 p-2 sm:p-3 rounded mb-3 border border-red-500/5 text-[10px] sm:text-xs">
              <div className="grid grid-cols-2 gap-1 sm:gap-2 opacity-70">
                <div>Device: {isMobile ? 'Mobile' : 'Desktop'}</div>
                <div>Touch: {diagnostics.browser.maxTouchPoints > 0 ? 'Yes' : 'No'}</div>
                <div>Screen: {diagnostics.screen.width}×{diagnostics.screen.height}</div>
                <div>Ratio: {diagnostics.screen.pixelRatio}x</div>
                <div>WebGL: {diagnostics.features.webGL ? 'Yes' : 'No'}</div>
                <div>WebGL2: {diagnostics.features.webGL2 ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 border border-red-500/50 text-red-500 py-2.5 sm:py-3 px-3 sm:px-4 transition-all duration-300 group"
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform duration-700" />
                <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                  Reboot
                </span>
              </button>
              
              <button
                onClick={this.copyDiagnostics}
                className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 border border-red-500/50 text-red-500 py-2.5 sm:py-3 px-3 sm:px-4 transition-all duration-300 group"
              >
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                  {this.state.copied ? 'Copied!' : 'Copy Log'}
                </span>
              </button>
            </div>

            {/* Expandable details */}
            <button
              onClick={this.toggleDetails}
              className="w-full flex items-center justify-between bg-black/30 hover:bg-black/50 active:bg-black/60 border border-red-500/10 text-red-500/70 py-2 px-3 sm:px-4 transition-all text-[10px] sm:text-xs"
            >
              <span className="uppercase tracking-wider">Full Diagnostics</span>
              {this.state.showDetails ? (
                <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>

            {/* Detailed diagnostics */}
            {this.state.showDetails && (
              <div className="mt-3 bg-black/50 p-3 sm:p-4 rounded border border-red-500/10 max-h-64 sm:max-h-96 overflow-auto">
                <pre className="text-[9px] sm:text-[10px] opacity-70 whitespace-pre-wrap break-all font-mono">
                  {formatDiagnostics(diagnostics)}
                </pre>
              </div>
            )}

            {/* Footer hint */}
            <div className="mt-3 sm:mt-4 text-center text-[10px] sm:text-xs opacity-50">
              <p>Copy diagnostics and send to developer</p>
              <p className="text-[9px] sm:text-[10px] mt-1">ODA.dream v{diagnostics.url.includes('localhost') ? 'dev' : '1.0.1'}</p>
            </div>
          </div>

          {/* Noise overlay */}
          <div className="fixed inset-0 pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-[0.03] mix-blend-screen bg-cover" />
        </div>
      );
    }

    return this.props.children;
  }
}
