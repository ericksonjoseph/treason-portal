# Stock Trading Platform

## Overview
A single-page algorithmic trading platform that visualizes backtesting results and live trading data with TradingView-style charts. The platform provides an intuitive interface for selecting algorithms, stocks, and dates to analyze trading performance.

## Project Goal
Build a stock trading platform that:
- Displays TradingView-style charts with buy/sell signals
- Allows users to select and run existing algorithms
- Shows real-time updates during market hours
- Communicates with a user-provided REST API (no backend development needed)
- Supports both backtesting and live trading modes

## Recent Changes (November 11, 2025)

### Color Scheme
- **Down candles and sell indicators**: Changed from traditional red to a softer blue (#93b4d4 and #7BA3D0)
- This applies to:
  - Down candlesticks on the chart
  - Sell signal markers (arrows)
  - SELL badges in trade timeline
  - Negative P&L values

### Features Implemented
1. **Dark Mode Toggle**: Moon/sun icon in the header to switch between light and dark themes
2. **Stock Ticker Selector**: Search input to select which stock to trade/backtest (e.g., AAPL, TSLA, MSFT)
3. **Date Picker**: Calendar component to select dates for:
   - Backtesting historical data
   - Viewing past live trading results
   - The label changes based on mode: "Backtest Date" or "Trading Date"

## Project Architecture

### Frontend Components
- **TradingDashboard**: Main page component that orchestrates the entire UI
- **TradingHeader**: Top navigation with mode selector (Backtest/Live) and dark mode toggle
- **TradingChart**: TradingView-style candlestick chart using lightweight-charts v5
- **ControlPanel**: Right sidebar with controls for:
  - Stock ticker selector
  - Date picker
  - Algorithm selector
  - Run/Stop/Settings buttons
  - Performance metrics
  - Trade timeline
- **AlgorithmSelector**: Dropdown to choose trading algorithms
- **TickerSelector**: Input field for stock ticker symbols
- **DatePicker**: Calendar component for date selection
- **MetricsCard**: Display key performance metrics
- **TradeTimeline**: Scrollable list of executed trades

### Technical Stack
- **Charts**: lightweight-charts v5.0.9 (TradingView's charting library)
- **UI Components**: Shadcn UI with Radix primitives
- **Styling**: Tailwind CSS with custom color tokens
- **Date Handling**: date-fns and react-day-picker
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Wouter
- **Data Fetching**: TanStack Query v5

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
