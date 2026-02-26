import { useEffect, useState } from 'react'
import { useToast } from '../../contexts/ToastContext'

const TOAST_ICONS = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
}

const TOAST_STYLES = {
  success: 'bg-[#2bee79] text-[#0B1F14] border-[#2bee79]',
  error: 'bg-red-500 text-white border-red-600',
  warning: 'bg-yellow-500 text-[#0B1F14] border-yellow-600',
  info: 'bg-blue-500 text-white border-blue-600',
}

const TOAST_PROGRESS_STYLES = {
  success: 'bg-[#0B1F14]/20',
  error: 'bg-white/20',
  warning: 'bg-[#0B1F14]/20',
  info: 'bg-white/20',
}

function Toast({ toast, onRemove }) {
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (toast.duration > 0) {
      const startTime = Date.now()
      let pausedTime = 0
      let pauseStart = 0

      const interval = setInterval(() => {
        if (isPaused) {
          if (pauseStart === 0) {
            pauseStart = Date.now()
          }
          return
        }

        if (pauseStart > 0) {
          pausedTime += Date.now() - pauseStart
          pauseStart = 0
        }

        const elapsed = Date.now() - startTime - pausedTime
        const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100)
        setProgress(remaining)
      }, 50)

      return () => clearInterval(interval)
    }
  }, [toast.duration, isPaused])

  const handleRemove = () => {
    setIsExiting(true)
    setTimeout(() => {
      onRemove(toast.id)
    }, 300)
  }

  return (
    <div
      className={`toast-item relative overflow-hidden rounded-xl border-2 shadow-2xl backdrop-blur-sm transition-all ${
        TOAST_STYLES[toast.type]
      } ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      style={{ minWidth: '300px', maxWidth: '400px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Progress bar */}
      {toast.duration > 0 && (
        <div className="absolute top-0 left-0 h-1 w-full overflow-hidden">
          <div
            className={`h-full transition-all ${TOAST_PROGRESS_STYLES[toast.type]}`}
            style={{
              width: `${progress}%`,
              transition: 'width 50ms linear',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex items-center gap-3 px-5 py-4 pt-5">
        <div className="shrink-0">
          <span className="material-symbols-outlined text-2xl">{TOAST_ICONS[toast.type]}</span>
        </div>
        <p className="flex-1 text-sm font-bold leading-snug">{toast.message}</p>
        <button
          onClick={handleRemove}
          className="shrink-0 rounded-lg p-1 transition-all hover:bg-black/10 hover:scale-110 active:scale-95"
          aria-label="Close notification"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-9999 flex items-end justify-end p-6 sm:p-8">
        <div className="pointer-events-auto flex flex-col gap-3">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from {
            transform: translateX(calc(100% + 2rem));
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes toastSlideOut {
          from {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateX(calc(100% + 2rem)) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes toastFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .toast-enter {
          animation: toastSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .toast-exit {
          animation: toastSlideOut 0.3s cubic-bezier(0.4, 0, 1, 1);
        }

        @media (max-width: 640px) {
          .toast-item {
            min-width: 280px;
            max-width: calc(100vw - 3rem);
          }
        }
      `}</style>
    </>
  )
}

