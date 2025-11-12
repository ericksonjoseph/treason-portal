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
- **Main Sidebar Navigation**: Collapsible sidebar with navigation menu
  - Charts: Main trading dashboard with live/backtest charts (`/`)
  - Run History: Manage all traitor execution runs (`/run-history`)
  - Reports: Collapsible menu with two sub-pages
    - Revenue Graph: Line chart analytics (`/reports/revenue-graph`)
    - Revenue Calendar: Calendar view analytics (`/reports/revenue-calendar`)
  - Sidebar can be toggled open/closed with hamburger menu
  - Reports menu can be expanded/collapsed with chevron indicator
  - Active page and sub-page are highlighted in the navigation

### Color Scheme
- **Down candles and sell indicators**: Changed from traditional red to a softer blue (#93b4d4 and #7BA3D0)
- This applies to:
  - Down candlesticks on the chart
  - Sell signal markers (arrows)
  - SELL badges in trade timeline
  - Negative P&L values

### Features Implemented

#### Run History Page
1. **Table View**: Comprehensive table displaying all traitor execution runs with:
   - Date and timestamp of execution
   - Traitor name used
   - Stock ticker traded
   - Mode (Backtest/Live Trading)
   - Status badge (Completed/Running/Failed)
   - Run-specific settings:
     - Aggressiveness (1-10)
     - Risk Tolerance (1-10)
     - Stop Loss percentage
     - Take Profit percentage
   - Results (for completed runs):
     - Total Trades
     - Win Rate percentage
     - Profit/Loss with color coding
2. **Global Filters**: Comprehensive filtering system with:
   - Filter by traitors, modes, tickers, status, and date ranges
   - Status filter: Completed, Running, Failed
   - Reset button to clear all filters
3. **Selection & Deletion**:
   - Checkbox selection for individual runs
   - Select all checkbox for bulk operations
   - Delete individual runs with confirmation dialog
   - Bulk delete selected runs with confirmation dialog
   - Toast notifications for successful deletions
4. **Color Coding**:
   - Positive profit shown in green
   - Negative profit shown in soft blue (#93b4d4)
   - Status badges color-coded by state

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
   - Trash icon on each row allows deleting individual run instances
   - Confirmation dialog before deletion
   - Shows informational message for single runs with clock icon
   - Automatically hidden when no runs exist for selected traitor/date
   - Smart selection management that updates when traitor or date changes

#### Reports Pages (Analytics)
**Two separate report pages accessible via collapsible Reports menu:**

**Revenue Graph Page** (`/reports/revenue-graph`):
1. **Performance Metrics Cards**: Display key stats like Total Trades, Win Rate, Total Profit, Average Trade
2. **Global Filters**: Comprehensive filtering system with:
   - **Traitor Filter**: Multi-select dropdown to choose one, multiple, or all traitors
   - **Mode Filter**: Select Backtest, Live Trading, or both
   - **Stock Ticker Filter**: Multi-select dropdown to choose one, multiple, or all tickers
   - **Date Range Picker**: Calendar component to select single dates or date ranges
   - **Reset Button**: One-click reset of all filters to default state
3. **Filter Behavior**:
   - Shows "All [Type]" when everything is selected
   - Shows "N selected" when multiple items are chosen
   - Shows individual label when only one item is selected
   - Date picker automatically closes after selecting a complete range
4. **Revenue Graph Visualization**:
   - Line chart showing revenue over time using Recharts
   - X-axis displays dates (formatted as "MMM d")
   - Y-axis shows revenue in dollars (formatted as $X,XXX.XX with 2 decimals)
   - Interactive tooltips with detailed information
   - Responsive design that adapts to container width

**Revenue Calendar Page** (`/reports/revenue-calendar`):
1. **Global Filters**: Same comprehensive filtering system as Revenue Graph page
   - Allows independent customization of filter layout per page
2. **Revenue Calendar Visualization**: 
     - Enhanced iCal/Google Calendar-style interface with four view modes:
       - **Month View**: Clean, compact grid (min-h-24 cells)
         - Revenue displayed with 2 decimals ($X,XXX.XX)
         - Stock symbol counts (not trade counts)
         - No traitor badges for cleaner overview
         - bg-card backgrounds with primary accents
       - **Week View**: Spacious 7-day layout (min-h-64 cells)
         - Large revenue text (text-2xl) with 2 decimal precision
         - Stock symbol counts
         - Traitor cards showing individual traitor revenue
         - Enhanced bg-card backgrounds with primary accents
       - **Day View**: Maximum detail single-day view (p-8 padding)
         - Huge revenue display (text-5xl) with 2 decimals
         - Stats cards showing "Stock Symbols" and "Active Traitors"
         - "Traitor Performance" section with symbol-level breakdown:
           - Each traitor shows total revenue at top
           - Individual stock symbols listed below with per-symbol revenue
           - Indented symbol list with left border for hierarchy
           - Format: Traitor total, then each symbol (AAPL, GOOGL, etc.) with revenue
           - Symbol revenues properly sum to traitor total
       - **Year View**: 12-month grid with larger boxes (p-5)
         - Monthly total revenue with 2 decimals
         - "X active days" instead of trade counts
         - bg-card backgrounds with hover effects
     - Enhanced visual design:
       - Today highlighted with bg-primary/10 background and ring effect
       - Consistent use of primary color theme throughout
       - Better spacing and typography hierarchy
       - All revenues formatted to 2 decimal places
       - Symbol breakdown uses indented layout with border-l-2
     - Navigation controls to move forward/backward through time
     - Smart date formatting that adapts to each view type
     - Empty states for days with no trading activity

## Project Architecture

### Frontend Components

#### Core Layout
- **App.tsx**: Root component with sidebar layout and routing
- **AppSidebar**: Main navigation sidebar with Charts, Run History, and collapsible Reports menu (Revenue Graph, Revenue Calendar sub-items)
- **ReportsLayout**: Shared layout wrapper for report pages with title, description, actions slot, and KPI cards slot

#### Run History Page Components
- **RunHistoryPage**: Run management page with table, filters, and delete operations
- **Run type**: TypeScript interface defining run structure (traitor, ticker, mode, date, settings, results)
- **mockRunData.ts**: Utility to generate 50 mock runs with randomized data

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
**Shared Components**:
- **ReportsLayout**: Shared wrapper providing consistent page structure (title, description, actions, KPI cards slot)
- **ReportsFilters**: Comprehensive filter panel with traitor, mode, ticker, and date range filters
- **MultiSelect**: Reusable multi-select dropdown component used for traitors, modes, and tickers
- **DateRangePicker**: Calendar component for selecting date ranges (with auto-close on complete selection)

**Revenue Graph Page** (`/reports/revenue-graph`):
- **RevenueGraphPage**: Revenue analytics page with KPI cards and line chart
- **RevenueGraph**: Line chart component using Recharts library to display revenue trends over time

**Revenue Calendar Page** (`/reports/revenue-calendar`):
- **RevenueCalendarPage**: Calendar-focused analytics page (no KPI cards)
- **RevenueCalendar**: Enhanced calendar visualization component with Day/Week/Month/Year views
  - Month view: Clean cells (min-h-24) showing only revenue and symbol counts (no traitor info)
  - Week view: Spacious layout (min-h-64) with traitor cards showing totals
  - Day view: Maximum detail with "Traitor Performance" breakdown
    - Each traitor shows total revenue
    - Individual stock symbols listed below with per-symbol revenue
    - Symbol revenues properly sum to parent traitor total
    - Indented layout with left border for visual hierarchy
  - Year view: 12-month overview with active days count
  - Stock symbol counts instead of trade counts
  - Enhanced color scheme using bg-primary/10 accents and borders
  - All monetary values formatted to 2 decimal places
  - Three-level revenue tracking: Total → Traitor → Symbol

**Shared Utilities**:
- **reportConstants.ts**: Centralized mock data (MOCK_TRAITORS, MOCK_TICKERS, TRADING_MODES)
- **mockRevenueData.ts**: Revenue data generation utilities for both graph and calendar views

### Technical Stack
- **Charts**: 
  - lightweight-charts v5.0.9 (TradingView's charting library for candlestick charts)
  - Recharts (Line charts for revenue trends in Reports page)
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
