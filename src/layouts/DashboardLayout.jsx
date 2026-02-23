import { Outlet } from 'react-router-dom'

import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import { useDashboardData } from '../hooks/useDashboardData'

export default function DashboardLayout() {
  const dashboardData = useDashboardData()

  return (
    <div className="flex h-screen overflow-hidden bg-[#102217] text-slate-100">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          marketCapValue={dashboardData.marketCapValue}
          marketCapChange={dashboardData.marketCapChange}
          marketCapPositive={dashboardData.marketCapPositive}
          volumeValue={dashboardData.volumeValue}
        />

        <Outlet context={dashboardData} />
      </main>
    </div>
  )
}
