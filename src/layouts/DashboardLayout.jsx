import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import ToastContainer from '../components/common/ToastContainer'
import { useDashboardData } from '../hooks/useDashboardData'

export default function DashboardLayout() {
  const dashboardData = useDashboardData()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#102217] dark:text-slate-100">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          marketCapValue={dashboardData.marketCapValue}
          marketCapChange={dashboardData.marketCapChange}
          marketCapPositive={dashboardData.marketCapPositive}
          volumeValue={dashboardData.volumeValue}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <Outlet context={dashboardData} />
      </main>

      <ToastContainer />
    </div>
  )
}
