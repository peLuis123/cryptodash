import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import DashboardLayout from '../layouts/DashboardLayout'
import ErrorBoundary from '../components/common/ErrorBoundary'
import AnalisisPage from '../pages/AnalisisPage'
import DashboardPage from '../pages/DashboardPage'
import MarketPage from '../pages/MarketPage'
import NotFoundPage from '../pages/NotFoundPage'
import PortfolioPage from '../pages/PortfolioPage'
import SectionPlaceholderPage from '../pages/SectionPlaceholderPage'
import SettingsPage from '../pages/SettingsPage'
import TransactionsPage from '../pages/TransactionsPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
            <Route path="portafolio" element={<ErrorBoundary><PortfolioPage /></ErrorBoundary>} />
            <Route path="analisis" element={<ErrorBoundary><AnalisisPage /></ErrorBoundary>} />
            <Route path="transacciones" element={<ErrorBoundary><TransactionsPage /></ErrorBoundary>} />
            <Route path="mercado" element={<ErrorBoundary><MarketPage /></ErrorBoundary>} />
            <Route path="settings" element={<ErrorBoundary><SettingsPage /></ErrorBoundary>} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
