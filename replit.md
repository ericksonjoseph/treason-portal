# Treason - Trading Platform

## Overview
Treason is a single-page trading platform designed for visualizing backtesting results and live trading data using TradingView-style charts. Its primary purpose is to provide an intuitive interface for users to select trading algorithms (referred to as "strategies"), stocks, and dates to analyze trading performance comprehensively. The platform aims to offer real-time updates during market hours, communicate with a user-provided REST API for data, and support both backtesting and live trading modes.

## User Preferences
- Blue for down/sell indicators (softer shade for better visibility)
- Dark mode toggle required
- Date selection for historical analysis
- Stock ticker selection for multi-asset trading

## System Architecture

### UI/UX Decisions
- **Color Scheme**: Down candles and sell indicators use a softer blue (#93b4d4 and #7BA3D0) instead of traditional red. This applies to candlesticks, sell signal markers, SELL badges, and negative P&L values.
- **Theming**: Supports dark mode, accessible via an icon-only toggle button in the top right corner (always visible on all pages).
- **Navigation**: Collapsible sidebar with main navigation (Charts, Run History, Reports). Reports include sub-pages for Revenue Graph and Revenue Calendar. Active pages are highlighted.
- **Dashboard Aesthetic**: Inspired by TradingView and Bloomberg Terminal for a professional financial dashboard feel.
- **Typography**: Professional typography with monospace fonts for financial data.

### Technical Implementations
- **Authentication**: Features a mock login system that accepts any credentials, generates a client-side UUID token stored in localStorage, and includes it as a Bearer token in API requests. Includes security features like automatic logout on 401, query cache clearing on logout, and protected routes. User profile is displayed in sidebar footer with circular avatar showing user initials; clicking opens a modal with user details and logout button.
- **Charts**:
    - **TradingView-style charts**: Implemented using `lightweight-charts v5` for candlestick charts.
    - **Analytics charts**: Line charts for revenue trends use the `Recharts` library.
- **Component Library**: Utilizes `Shadcn UI` with `Radix primitives` for UI components (Select, Popover, Calendar, etc.).
- **Styling**: `Tailwind CSS` is used for styling, incorporating custom color tokens.
- **Date Handling**: `date-fns` and `react-day-picker` are used for date manipulations and calendar components.
- **State Management**: Primarily relies on `React hooks` (`useState`, `useEffect`, `useMemo`).
- **Routing**: Handled by `Wouter`.
- **Data Fetching**: `TanStack Query v5` is used for efficient data fetching and caching.

### Feature Specifications
- **Run History Page**: Displays a table of all strategy execution runs with details (date, strategy, stock, mode, status, settings, results like P&L, Win Rate). Includes global filters (strategies, modes, tickers, status, date ranges), selection for bulk deletion, and color-coded results.
- **Charts Page (Dashboard)**:
    - **Stock Ticker Selector**: Input for selecting stock symbols (e.g., AAPL, TSLA). API requests only fire on blur (when input loses focus) or Enter key press to prevent excessive API calls during typing.
    - **Date Picker**: For selecting historical backtesting dates or past live trading dates.
    - **Run Button Behavior**: In Live Trading mode, the Run button is only enabled when viewing the current date. When viewing any historical date in Live Trading mode, the button is disabled with an explanatory message. In Backtest mode, the Run button is always enabled regardless of the selected date.
    - **Run Instance Selector**: A dropdown to choose between multiple runs of a strategy on the same day, with options to delete individual instances. When navigating from the Revenue Calendar with a specific run ID in the URL parameters, the selector automatically selects the corresponding run instead of defaulting to the first run.
    - **Strategy Settings Widget**: A toggleable view for configuring run-specific parameters like risk tolerance, sizing, stop loss, take profit, and aggressiveness via dropdowns and sliders. Includes a playback speed slider (0-1000ms range) that controls the delay between backtest execution steps, displayed in seconds format (e.g., 500ms → "0.5s").
    - **Real-time Backtest Monitoring**: When a backtest is initiated, the system automatically polls the run every 1 second until the `completed_at` field is populated. Each poll refreshes bars, executions, and decisions data to show progressive backtest results. Polling automatically stops when the backtest completes.
    - **Stop Button**: Allows cancelling an in-progress backtest run by calling the `/v1/alpaca/runs/{run_id}/cancel` endpoint. Stops polling, updates UI state, and shows a success notification.
- **Reports Pages (Analytics)**:
    - **Shared Features**: Both reports pages include comprehensive global filters (strategy, mode, ticker, date range) and a shared `ReportsLayout` for consistent structure.
    - **Revenue Graph Page**: Displays key performance metrics (Total Trades, Win Rate, Total Profit) and a line chart of revenue over time using Recharts, with interactive tooltips.
    - **Revenue Calendar Page**: Provides an iCal/Google Calendar-style interface with four view modes (Month, Week, Day, Year). Fetches real run data from `/v1/alpaca/runs/search` (defaults to last 90 days if no date range specified). Aggregates profit values by `start_time` (the actual trade date), strategy, and symbol. The `start_time` field represents when the trades occurred, not when the run was executed (`started_at`) or completed (`completed_at`). Filters dynamically populate from API data (strategies from `/v1/alpaca/strategys/search`, tickers from unique symbols in runs). Each view offers varying levels of detail, from monthly totals to a detailed daily breakdown showing strategy and symbol-level revenue, with enhanced visual design and navigation. Clicking on a symbol in day view navigates to the Charts page with pre-populated URL parameters: ticker (symbol), date (start_time), strategy (strategy_id), mode (backtest/live), and run (run_id), allowing the user to immediately view that specific trading run's details.

### System Design Choices
- **Frontend-focused**: The platform is designed to be purely frontend, communicating with a user-provided REST API without requiring backend development for Treason itself.
- **Terminology**: Uses "Strategies" for trading algorithms.
- **Data Storage**: Currently uses in-memory storage (`MemStorage`) but is designed for integration with external REST APIs.
- **API Integration**: The platform uses a type-safe generated API client (located in `src/api/generated`) based on the backend Swagger/OpenAPI spec. The client is configured with base URL (via `VITE_API_BASE_URL` or defaults to `https://treason.nephue.com`) and Bearer token authentication.
  - **Bars/Candlesticks**: Fetched from `/v1/alpaca/bars/search` endpoint with filters for symbol, timeframe (1Min), and timestamp range. The timestamp range is calculated from the selected date: start of day (00:00:00) to start of next day (00:00:00, exclusive) using `FILTER_TYPE_RANGE_EXCLUSIVE_MAX`. Response (`V1Bar[]`) is transformed to OHLC format with Unix timestamps for the TradingView-style chart.
  - **Trading Decisions**: Fetched from `/v1/alpaca/decisions/search` endpoint when strategy is running. Response (`V1Decision[]`) with `SIGNAL_TYPE_BUY`/`SIGNAL_TYPE_SELL` is transformed to buy/sell markers displayed on the chart using the `price` field.
  - **Strategies**: Fetched from `/v1/alpaca/strategys/search` endpoint, filtered for active strategies only (`isActive = true`), sorted alphabetically by name. Response (`V1Strategy[]`) populates the strategy dropdown selector. The first strategy is auto-selected when the data loads.
  - **Runs**: Fetched from `/v1/alpaca/runs/search` endpoint with filters for selected strategy ID, mode type ('BACKTEST' or 'LIVE'), and startTime date range (start of selected day to start of next day, exclusive end using `FILTER_TYPE_RANGE_EXCLUSIVE_MAX`). This filters runs by the date range being analyzed, not when the run was executed. Response (`V1Run[]`) uses snake_case fields and populates the run instance dropdown, sorted by startedAt timestamp. Each run includes metrics: profit, win_rate, total_trades, and sharpe_ratio.
  - **Run Backtest**: Initiated via `/v1/alpaca/runbacktest` endpoint when the Run button is clicked. Sends strategy ID, symbol, timeframe (1Min), date range (start/end time), and playback speed (formatted as "{value}s") to execute a backtest. The API returns a `run_id` (snake_case) which triggers automatic 1-second polling to monitor backtest progress until `completed_at` is populated. Success/error toast notifications are shown and cache is invalidated to refresh the runs list.
  - **Cancel Run**: Called via `/v1/alpaca/runs/{runId}/cancel` endpoint when the Stop button is pressed during an active backtest. Cancels the running backtest, stops polling, updates UI state, and invalidates queries to refresh data.
  - **Executions**: Fetched from `/v1/alpaca/executions/search` endpoint filtered directly by `runId`. Response uses snake_case fields (`fill_time`, `fill_price`, `fill_quantity`). Trade history displays executions with valid fill data, deriving action from quantity sign (positive = buy, negative = sell).
  - **Performance Metrics**: Displayed metrics (Total P/L, Win Rate, Total Trades, Sharpe Ratio) are sourced directly from the selected run entity's snake_case fields (profit.value, win_rate.value, total_trades, sharpe_ratio.value).
  - **Fallback**: When API endpoints are unavailable or return errors, empty arrays are returned and metrics show "-". The UI remains functional but dropdowns/tables will be empty until the backend provides data.

## External Dependencies
- **Charting Libraries**: `lightweight-charts v5.0.9`, `Recharts`
- **UI Framework**: `Shadcn UI`
- **Styling Framework**: `Tailwind CSS`
- **Date Utilities**: `date-fns`, `react-day-picker`
- **Routing Library**: `Wouter`
- **Data Fetching Library**: `TanStack Query v5`
- **REST API**: Designed to integrate with a user-provided external REST API for trading data and execution.