import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-red-500 font-mono">
            <div className="max-w-md w-full border border-red-500/30 bg-red-950/10 p-8 rounded-sm backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                
                <div className="flex items-center gap-4 mb-6">
                    <AlertTriangle className="w-10 h-10 animate-pulse" strokeWidth={1.5} />
                    <div>
                        <h1 className="text-xl font-bold tracking-widest uppercase">System Failure</h1>
                        <span className="text-xs opacity-70">Critical Runtime Exception</span>
                    </div>
                </div>

                <div className="bg-black/50 p-4 rounded mb-6 border border-red-500/10 overflow-auto max-h-32">
                    <code className="text-[10px] break-all opacity-80 block">
                        {this.state.error?.toString() || 'Unknown Error'}
                    </code>
                </div>

                <button 
                    onClick={this.handleReload}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 py-3 px-4 transition-all duration-300 group"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                    <span className="text-xs font-bold tracking-widest uppercase">Reboot System</span>
                </button>
            </div>
            
            <div className="fixed inset-0 pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-[0.03] mix-blend-screen bg-cover" />
        </div>
      );
    }

    return this.props.children;
  }
}