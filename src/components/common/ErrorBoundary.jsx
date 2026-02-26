import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = '/'
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8 dark:bg-[#102217]">
          <div className="w-full max-w-2xl text-center">
            {/* Error Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20"></div>
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-red-500 bg-white dark:bg-[#14281d]">
                  <span className="material-symbols-outlined text-6xl text-red-500">error</span>
                </div>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="mb-4 bg-linear-to-r from-red-500 to-red-600 bg-clip-text text-6xl font-black text-transparent">
              Oops!
            </h1>

            {/* Message */}
            <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Something went wrong
            </h2>
            <p className="mb-2 text-lg text-slate-600 dark:text-slate-400">
              An unexpected error occurred while loading this section.
            </p>
            <p className="mb-8 text-sm text-slate-500 dark:text-slate-500">
              Don't worry, your data is safe. Try reloading or go back to the dashboard.
            </p>

            {/* Error Details (Development) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-8 rounded-xl border-2 border-red-500/20 bg-red-500/5 p-4 text-left">
                <summary className="cursor-pointer text-sm font-bold text-red-600 dark:text-red-400">
                  🐛 Developer Info (click to expand)
                </summary>
                <div className="mt-4 space-y-2">
                  <div className="rounded-lg bg-slate-900 p-4 text-left">
                    <p className="text-xs font-bold text-red-400">Error:</p>
                    <p className="font-mono text-xs text-slate-300">{this.state.error.toString()}</p>
                  </div>
                  {this.state.errorInfo && (
                    <div className="rounded-lg bg-slate-900 p-4 text-left">
                      <p className="text-xs font-bold text-red-400">Stack Trace:</p>
                      <pre className="mt-2 overflow-auto font-mono text-xs text-slate-300">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 rounded-lg bg-[#2bee79] px-6 py-3 text-sm font-bold text-[#0B1F14] transition-all hover:bg-[#25d66b] hover:shadow-lg"
              >
                <span className="material-symbols-outlined">home</span>
                Go to Dashboard
              </button>
              
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-[#2bee79] hover:text-[#2bee79] dark:border-[#2bee79]/30 dark:bg-[#14281d] dark:text-slate-300"
              >
                <span className="material-symbols-outlined">refresh</span>
                Reload Page
              </button>
            </div>

            {/* Decorative elements */}
            <div className="mt-12 flex items-center justify-center gap-8 opacity-30">
              <div className="h-16 w-16 rounded-lg border-2 border-dashed border-red-300 dark:border-red-700"></div>
              <div className="h-12 w-12 rounded-full border-2 border-dashed border-red-300 dark:border-red-700"></div>
              <div className="h-20 w-20 rounded-lg border-2 border-dashed border-red-300 dark:border-red-700"></div>
              <div className="h-12 w-12 rounded-full border-2 border-dashed border-red-300 dark:border-red-700"></div>
              <div className="h-16 w-16 rounded-lg border-2 border-dashed border-red-300 dark:border-red-700"></div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
