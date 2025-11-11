# Design Guidelines: Stock Trading Platform with Backtesting

## Design Approach

**Selected Approach**: Hybrid - Financial Dashboard System inspired by TradingView, Bloomberg Terminal, and Robinhood's clean interface, combined with Material Design principles for data-dense applications.

**Key Principles**: 
- Data-first: Charts and metrics are hero elements
- Efficiency: Quick access to all trading functions
- Clarity: Clear visual hierarchy for critical trading information
- Density: Pack information without overwhelming

## Core Design Elements

### Typography
- **Primary Font**: Inter or Roboto from Google Fonts
- **Headers**: 600 weight, 24px (H1), 20px (H2), 16px (H3)
- **Body**: 400 weight, 14px for general content
- **Data/Numbers**: 500 weight, 16px for metrics, monospace (Roboto Mono) for precise values
- **Chart Labels**: 400 weight, 12px

### Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, and 8 (p-2, p-4, p-6, p-8, etc.)
- Component padding: p-4 to p-6
- Section gaps: gap-4 to gap-6
- Card spacing: p-6 internally, gap-4 between cards

**Grid Structure**:
- Main layout: Two-column split (70/30) - Chart area (left/main) + Controls sidebar (right)
- Mobile: Stack to single column, controls collapse to expandable panel
- Container: max-w-full with px-4 to px-6 padding

### Component Library

**Navigation/Header** (h-16, fixed top):
- Left: Logo and platform name
- Center: Mode toggle (Backtest / Live Trading) - prominent, pill-shaped
- Right: Algorithm selector dropdown, Run/Stop button, Settings icon

**Chart Display** (Primary focus, 60-70vh minimum):
- Full TradingView widget integration
- Buy signals: Green markers/arrows pointing up
- Sell signals: Red markers/arrows pointing down
- Timeline scrubber below chart for backtests
- Chart controls toolbar (timeframe, indicators) positioned top-right within chart container

**Controls Sidebar** (Fixed right panel, scrollable):
- **Algorithm Selector**: Dropdown with search, shows algo name and brief stats
- **Quick Actions Card**: Run/Stop buttons (large, primary), with loading states
- **Active Trades Panel**: List of current positions with entry price, current P/L
- **Performance Metrics Card**: Grid layout (2 columns)
  - Total P/L (large, prominent)
  - Win Rate percentage
  - Total Trades count
  - Max Drawdown
  - Sharpe Ratio

**Trade Execution Timeline** (Below chart, expandable panel):
- Table layout with columns: Timestamp, Action (Buy/Sell), Price, Quantity, P/L
- Color-coded rows (subtle green/red backgrounds for profit/loss)
- Sticky header on scroll
- Click row to highlight on chart

**Status Indicators**:
- Connection status dot (top-right): Green (connected), Yellow (connecting), Red (disconnected)
- Market hours indicator: Badge showing "Market Open" or "Market Closed"
- Algorithm status: Running/Stopped with timestamp

### UI Patterns

**Cards**: Rounded corners (rounded-lg), subtle border, p-6 internal padding, gap-4 between elements
**Buttons**: 
- Primary (Run): Large, rounded-lg, px-6 py-3
- Secondary (Stop): Outlined variant
- Icon buttons: Square, p-2, rounded-md
**Dropdowns**: Full-width in sidebar, search-enabled, max-h-60 with scroll
**Metrics Display**: Large numbers (text-2xl to text-3xl), labels below in muted text (text-sm)
**Tables**: Dense rows (py-2), alternating row backgrounds, sticky headers

### Animations
- Chart marker animations: Simple fade-in when signals appear (live mode)
- Loading states: Subtle pulse on Run button when processing
- Metric updates: Brief highlight flash when values change (live trading)
- No scroll animations or decorative transitions

### Images
This application does not use hero images or decorative imagery. All visuals are functional: charts, graphs, and data visualizations rendered by TradingView and metrics displays.

### Responsive Behavior
- Desktop (lg+): Side-by-side layout, fixed sidebar
- Tablet (md): Maintain side-by-side but narrow sidebar
- Mobile: Stack layout, sidebar becomes bottom sheet/drawer, chart takes full width