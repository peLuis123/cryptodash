import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import DashboardLayout from '../layouts/DashboardLayout'
import AnalisisPage from '../pages/AnalisisPage'
import DashboardPage from '../pages/DashboardPage'
import MarketPage from '../pages/MarketPage'
import PortfolioPage from '../pages/PortfolioPage'
import SectionPlaceholderPage from '../pages/SectionPlaceholderPage'
import TransactionsPage from '../pages/TransactionsPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="portafolio" element={<PortfolioPage />} />
          <Route path="analisis" element={<AnalisisPage />} />
          <Route path="transacciones" element={<TransactionsPage />} />
          <Route path="mercado" element={<MarketPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
