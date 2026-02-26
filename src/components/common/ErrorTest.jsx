/**
 * Test component to trigger errors and test ErrorBoundary
 * Usage: Import and add <ErrorTest /> anywhere in your app (dev only)
 */

import { useState } from 'react'

export default function ErrorTest() {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error('🧪 Test Error: ErrorBoundary is working!')
  }

  if (import.meta.env.PROD) return null

  return (
    <div className="fixed bottom-24 left-4 z-9999 rounded-lg border-2 border-red-500 bg-red-500/10 p-3 backdrop-blur-sm">
      <p className="mb-2 text-xs font-bold text-red-600 dark:text-red-400">
        🧪 Development Tool
      </p>
      <button
        onClick={() => setShouldThrow(true)}
        className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-red-600"
      >
        <span className="material-symbols-outlined text-sm">bug_report</span>
        Test Error Boundary
      </button>
    </div>
  )
}
