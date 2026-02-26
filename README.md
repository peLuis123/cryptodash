# 🚀 CryptoDash - Professional Crypto Portfolio Tracker

<div align="center">

![CryptoDash](https://img.shields.io/badge/CryptoDash-Pro%20Terminal-2bee79?style=for-the-badge&logo=bitcoin&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Latest-646cff?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**A modern, feature-rich cryptocurrency portfolio tracker with real-time market data, interactive charts, and comprehensive portfolio management.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Project Structure](#-project-structure) • [API](#-api-integration)

</div>

---

## 📋 Overview

CryptoDash is a professional-grade, frontend-only cryptocurrency dashboard application that provides real-time market insights, portfolio tracking, and comprehensive crypto analysis. Built with modern web technologies and designed with a focus on user experience, performance, and responsive design.

### 🎯 Key Highlights

- **Real-time Data**: Live cryptocurrency prices and market data from CoinGecko API
- **Portfolio Management**: Track your crypto holdings with detailed analytics
- **Interactive Charts**: Hover-enabled charts with tooltips and performance metrics
- **Dark/Light Mode**: Elegant theme switching with smooth transitions
- **Bilingual Support**: Full English and Spanish translations
- **Mobile Optimized**: Fully responsive with hamburger menu on mobile devices
- **Error Handling**: Comprehensive error boundaries and 404 pages
- **Professional UI**: Modern design with smooth animations and micro-interactions

---

## ✨ Features

### 📊 Dashboard

- **4 Summary Cards**: Total Balance, 24h Change, Profit/Loss, Total Assets
- **Performance Chart**: Interactive Bitcoin price chart with hover tooltips
- **Market Table**: Top cryptocurrencies with real-time prices and 7-day sparklines
- **Responsive Grid Layout**: Adapts beautifully from mobile to desktop

### 💼 Portfolio Management

- **Asset Tracking**: Monitor your cryptocurrency holdings in real-time
- **Performance Visualization**: 30-day portfolio performance chart
- **Allocation Insights**: View asset distribution and strongest performers
- **CSV Export**: Export portfolio data with proper formatting
- **Add/Remove Assets**: Dynamic portfolio management

### 📈 Market Explorer

- **2,500+ Cryptocurrencies**: Comprehensive market coverage
- **Advanced Filters**: Filter by market cap, volume, and 24h change
- **Real-time Search**: Instant search across all assets
- **Asset Preview**: Side drawer with detailed coin information
- **Market Statistics**: Total market cap, volume, and trends

### 🔍 Analysis Tools

- **Volatility Metrics**: Analyze crypto volatility and risk
- **Performance Comparison**: Compare multiple assets
- **Historical Data**: Price trends and historical performance
- **Statistical Insights**: Mean volatility, price ranges, and more

### 💰 Transactions

- **Transaction History**: Complete record of buys, sells, and transfers
- **Advanced Filtering**: Filter by type, status, asset, and date range
- **Search Functionality**: Quick search across all transactions
- **CSV Export**: Export transaction history
- **Detailed View**: Modal with complete transaction details

### ⚙️ Settings & Customization

- **Theme Toggle**: Switch between dark and light modes
- **Language Selection**: English and Spanish support
- **Developer Tools** (Dev mode only): Test error boundaries and 404 pages
- **Persistent Preferences**: Settings saved to localStorage

### 🎨 UI/UX Features

- **Loading Skeletons**: Animated placeholders instead of loading text
- **Enhanced Toasts**: Progress bar, pause on hover, smooth animations
- **Error Boundaries**: Graceful error handling with debug info (dev mode)
- **404 Page**: Custom not found page with navigation
- **Responsive Design**: Mobile-first with hamburger menu
- **Interactive Charts**: Tooltips showing exact values on hover
- **Smooth Animations**: CSS transitions and keyframe animations
- **Accessibility**: Keyboard navigation and ARIA labels

### 🔧 Technical Features

- **Code Splitting**: Optimized bundle sizes with React lazy loading
- **Context API**: Global state management for settings and toasts
- **Custom Hooks**: Reusable logic for translations, charts, and data fetching
- **Error Handling**: Try-catch blocks and error boundaries
- **SEO Optimization**: Dynamic meta titles and descriptions per page
- **Mobile Navigation**: Sidebar collapses to hamburger menu on mobile
- **Horizontal Scroll**: Tables scroll horizontally on small screens

---

## 🛠️ Tech Stack

### Core Technologies

- **React 18.3** - UI library with hooks and context
- **Vite** - Next-generation frontend tooling
- **React Router 7** - Client-side routing
- **TailwindCSS 3** - Utility-first CSS framework

### State Management

- **Context API** - Global state (Settings, Toasts)
- **Custom Hooks** - Reusable stateful logic

### API Integration

- **CoinGecko API** - Real-time cryptocurrency data
- **Axios** - HTTP client with interceptors

### Development Tools

- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Material Symbols** - Icon library

---

## 📦 Installation

### Prerequisites

- **Node.js** 16+ and npm/yarn
- **Git** for cloning the repository

### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/crypto-dash.git
cd crypto-dash

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
crypto-dash/
├── public/                 # Static assets
├── src/
│   ├── api/               # API integration
│   │   ├── axios.js       # Axios instance configuration
│   │   ├── dashboard/     # Dashboard API calls
│   │   ├── market/        # Market data API
│   │   └── portfolio/     # Portfolio API
│   │
│   ├── assets/            # Images and static files
│   │
│   ├── components/        # React components
│   │   ├── common/        # Reusable components
│   │   │   ├── CountUpValue.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   └── ToastContainer.jsx
│   │   ├── dashboard/     # Dashboard components
│   │   ├── layout/        # Layout components (Sidebar, TopBar)
│   │   ├── market/        # Market components
│   │   ├── portfolio/     # Portfolio components
│   │   └── transactions/  # Transaction components
│   │
│   ├── constants/         # App constants
│   │   └── navigation.js  # Navigation configuration
│   │
│   ├── contexts/          # React Context providers
│   │   ├── SettingsContext.jsx  # Theme, language settings
│   │   └── ToastContext.jsx     # Toast notifications
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── useChartTooltip.js
│   │   ├── useDashboardData.js
│   │   ├── useDocumentTitle.js
│   │   └── useTranslations.js
│   │
│   ├── i18n/              # Internationalization
│   │   └── translations.js  # EN/ES translations
│   │
│   ├── layouts/           # Page layouts
│   │   └── DashboardLayout.jsx
│   │
│   ├── pages/             # Route pages
│   │   ├── AnalisisPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── MarketPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── PortfolioPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── TransactionsPage.jsx
│   │
│   ├── router/            # Routing configuration
│   │   └── AppRouter.jsx
│   │
│   ├── utils/             # Utility functions
│   │   ├── csvExport.js         # CSV export functionality
│   │   ├── dashboardCharts.js   # Chart utilities
│   │   └── dashboardFormatters.js  # Number/currency formatting
│   │
│   ├── App.jsx            # Root component
│   ├── App.css            # Global styles
│   ├── main.jsx           # App entry point
│   └── index.css          # Tailwind imports
│
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── eslint.config.js       # ESLint configuration
```

---

## 🔌 API Integration

### CoinGecko API

CryptoDash uses the **CoinGecko API** (free tier) to fetch real-time cryptocurrency data.

**Endpoints Used:**

- `/coins/markets` - Market data for top cryptocurrencies
- `/coins/{id}/market_chart` - Historical price data for charts
- `/global` - Global market statistics

**Features:**

- Real-time price updates
- Market cap and volume data
- 24h/7d price changes
- Historical performance data
- 2,500+ supported cryptocurrencies

**Rate Limiting:**

- Free tier: 10-50 calls/minute
- Implemented caching and request optimization
- No API key required for basic usage

**API Configuration:**

```javascript
// src/api/axios.js
const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

**Environment Variables:**

```bash
# .env (optional)
VITE_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
VITE_API_TIMEOUT=15000
```

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Create production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

---

## 🎯 Key Features for Recruiters

### Technical Proficiency

- ✅ **Modern React**: Hooks, Context API, custom hooks
- ✅ **State Management**: Context API with optimized re-renders
- ✅ **Routing**: React Router with nested routes and error boundaries
- ✅ **API Integration**: Axios with proper error handling
- ✅ **Responsive Design**: Mobile-first approach with Tailwind
- ✅ **Performance**: Code splitting, lazy loading, memoization
- ✅ **SEO**: Dynamic meta tags and document titles

### Code Quality

- ✅ **Clean Architecture**: Organized folder structure
- ✅ **Reusable Components**: DRY principle applied
- ✅ **Custom Hooks**: Extracting complex logic
- ✅ **Error Handling**: Try-catch blocks and error boundaries
- ✅ **TypeScript-ready**: JSDoc comments for type hints
- ✅ **ESLint**: Consistent code style

### UX/UI Skills

- ✅ **Smooth Animations**: CSS transitions and keyframes
- ✅ **Loading States**: Skeleton loaders instead of spinners
- ✅ **Toast Notifications**: With progress bars and pause on hover
- ✅ **Interactive Charts**: Tooltips and hover effects
- ✅ **Dark Mode**: Complete theme system
- ✅ **Accessibility**: ARIA labels and keyboard navigation

### Problem Solving

- ✅ **CSV Export**: Custom implementation with proper escaping
- ✅ **Chart Tooltips**: Mouse tracking with SVG elements
- ✅ **Mobile Menu**: State management with overlay and animations
- ✅ **Dynamic Translations**: i18n system with language switching
- ✅ **Error Boundaries**: Graceful error handling at route level

---

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🚧 Future Enhancements

- [ ] Add more chart types (candlestick, area, bar)
- [ ] Implement WebSocket for real-time updates
- [ ] Add cryptocurrency news feed
- [ ] Portfolio performance comparison tools
- [ ] Advanced technical indicators
- [ ] Price alerts and notifications
- [ ] Multiple portfolio support
- [ ] Export to PDF reports
- [ ] Multi-currency support (USD, EUR, PEN)
- [ ] Social sharing features

---

## 📄 License

This project is a **portfolio/educational project** and is available for review and learning purposes.

---

## 👨‍💻 Author

**Pedro Luis Ramos Calla**

_Frontend Developer | React Specialist_

- 💼 Portfolio: [Your Portfolio URL]
- 💻 GitHub: [@yourusername](https://github.com/yourusername)
- 📧 Email: your.email@example.com
- 🔗 LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- **CoinGecko API** - For providing free cryptocurrency data
- **TailwindCSS** - For the amazing utility-first CSS framework
- **React Team** - For the incredible React library
- **Vite** - For lightning-fast build tooling
- **Google Fonts** - Material Symbols icons

---

## 📞 Contact

For any questions, suggestions, or collaboration opportunities, feel free to reach out!

**Built with ❤️ and ☕ by Pedro Luis Ramos Calla**

---

<div align="center">

### ⭐ If you found this project interesting, please consider giving it a star!

![Crypto](https://img.shields.io/badge/Crypto-Dashboard-2bee79?style=flat-square&logo=bitcoin)
![Made with React](https://img.shields.io/badge/Made%20with-React-61dafb?style=flat-square&logo=react)
![Styled with Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind-06b6d4?style=flat-square&logo=tailwindcss)

</div>
