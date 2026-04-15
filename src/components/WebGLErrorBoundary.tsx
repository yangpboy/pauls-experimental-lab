import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class WebGLErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WebGL Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">WebGL Error</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            It seems your browser encountered an issue rendering the 3D content. 
            This can happen if too many WebGL contexts are active or if your hardware doesn't support it.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WebGLErrorBoundary;
