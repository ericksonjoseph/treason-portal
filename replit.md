# Treason - Trading Platform

## Overview
Treason is a single-page trading platform that visualizes backtesting results and live trading data with TradingView-style charts. The platform provides an intuitive interface for selecting traitors (trading algorithms), stocks, and dates to analyze trading performance.

## Project Goal
Build a trading platform named "Treason" that:
- Displays TradingView-style charts with buy/sell signals
- Allows users to select and run existing traitors (trading algorithms)
- Shows real-time updates during market hours
- Communicates with a user-provided REST API (no backend development needed)
- Supports both backtesting and live trading modes

## Terminology
- **Treason**: The name of the software/platform
- **Traitors**: Trading algorithms (instead of "algorithms" or "algos")

## Recent Changes (November 11, 2025)

### Navigation
- **Main Sidebar Navigation**: Added collapsible sidebar with navigation menu
  - Charts: Main trading dashboard with live/backtest charts
  - Reports: Analytics and reporting page
  - Sidebar can be toggled open/closed with hamburger menu
  - Active page is highlighted in the navigation

### Color Scheme
- **Down candles and sell indicators**: Changed from traditional red to a softer blue (#93b4d4 and #7BA3D0)
- This applies to:
  - Down candlesticks on the chart
  - Sell signal markers (arrows)
  - SELL badges in trade timeline
  - Negative P&L values

### Features Implemented

#### Charts Page (Dashboard)
1. **Dark Mode Toggle**: Moon/sun icon in the header to switch between light and dark themes
2. **Stock Ticker Selector**: Search input to select which stock to trade/backtest (e.g., AAPL, TSLA, MSFT)
3. **Date Picker**: Calendar component to select dates for:
   - Backtesting historical data
   - Viewing past live trading results
   - The label changes based on mode: "Backtest Date" or "Trading Date"
4. **Run Instance Selector**: When a traitor has run multiple times on the same day:
   - Shows a dropdown with all run instances when multiple runs exist
   - Displays run number, timestamp, and status (completed/running/failed)
   - Shows informational message for single runs with clock icon
   - Automatically hidden when no runs exist for selected traitor/date
   - Smart selection management that updates when traitor or date changes

#### Reports Page (Analytics)
1. **Global Filters**: Comprehensive filtering system with:
   - **Traitor Filter**: Multi-select dropdown to choose one, multiple, or all traitors
   - **Mode Filter**: Select Backtest, Live Trading, or both
   - **Stock Ticker Filter**: Multi-select dropdown to choose one, multiple, or all tickers
   - **Date Range Picker**: Calendar component to select single dates or date ranges
   - **Reset Button**: One-click reset of all filters to default state
2. **Filter Behavior**:
   - Shows "All [Type]" when everything is selected
   - Shows "N selected" when multiple items are chosen
   - Shows individual label when only one item is selected
   - Date picker automatically closes after selecting a complete range
3. **Performance Metrics Cards**: Display key stats like Total Trades, Win Rate, Total Profit, Average Trade

## Project Architecture

### Frontend Components

#### Core Layout
- **App.tsx**: Root component with sidebar layout and routing
- **AppSidebar**: Main navigation sidebar with Charts and Reports menu items

#### Charts Page Components
- **TradingDashboard**: Main charts page that orchestrates the trading UI
- **TradingHeader**: Top navigation with mode selector (Backtest/Live) and dark mode toggle
- **TradingChart**: TradingView-style candlestick chart using lightweight-charts v5
- **ControlPanel**: Right sidebar with controls for:
  - Stock ticker selector
  - Date picker
  - Traitor selector
  - Run instance selector (when multiple runs exist)
  - Run/Stop/Settings buttons
  - Performance metrics
  - Trade timeline
- **AlgorithmSelector**: Dropdown to choose trading traitors
- **TickerSelector**: Input field for stock ticker symbols
- **DatePicker**: Calendar component for single date selection
- **RunInstanceSelector**: Shows different run instances when traitor ran multiple times on same day
- **MetricsCard**: Display key performance metrics
- **TradeTimeline**: Scrollable list of executed trades

#### Reports Page Components
- **Reports**: Analytics and reporting page with global filters
- **ReportsFilters**: Comprehensive filter panel with traitor, mode, ticker, and date range filters
- **MultiSelect**: Reusable multi-select dropdown component used for traitors, modes, and tickers
- **DateRangePicker**: Calendar component for selecting date ranges (with auto-close on complete selection)

### Technical Stack
- **Charts**: lightweight-charts v5.0.9 (TradingView's charting library)
- **UI Components**: Shadcn UI with Radix primitives (Select, Popover, Calendar, etc.)
- **Styling**: Tailwind CSS with custom color tokens
- **Date Handling**: date-fns and react-day-picker
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Routing**: Wouter
- **Data Fetching**: TanStack Query v5
- **Type Definitions**: Centralized in `client/src/types/traitor.ts` (Traitor, RunInstance interfaces)

### Storage
- Currently using in-memory storage (MemStorage)
- Ready to integrate with user's REST API

## Design Guidelines
- Financial dashboard aesthetic inspired by TradingView/Bloomberg Terminal
- Softer blue colors for down/sell indicators instead of traditional red
- Dark mode support with proper color contrast
- Responsive layout with fixed sidebar width
- Professional typography with monospace fonts for financial data

## User Preferences
- Blue for down/sell indicators (softer shade for better visibility)
- Dark mode toggle required
- Date selection for historical analysis
- Stock ticker selection for multi-asset trading
