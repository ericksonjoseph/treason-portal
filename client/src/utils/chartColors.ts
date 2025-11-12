export const TOTAL_REVENUE_COLOR = 'hsl(var(--primary))';

export const TRAITOR_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
];

export const SYMBOL_RUN_COLORS = [
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#fbbf24', // amber-400
  '#a78bfa', // violet-400
  '#f472b6', // pink-400
  '#2dd4bf', // teal-400
  '#fb923c', // orange-400
  '#818cf8', // indigo-400
  '#93c5fd', // blue-300
  '#6ee7b7', // emerald-300
  '#fcd34d', // amber-300
  '#c4b5fd', // violet-300
  '#f9a8d4', // pink-300
  '#5eead4', // teal-300
  '#fdba74', // orange-300
  '#a5b4fc', // indigo-300
];

export function getTraitorColor(index: number): string {
  return TRAITOR_COLORS[index % TRAITOR_COLORS.length];
}

export function getSymbolRunColor(index: number): string {
  return SYMBOL_RUN_COLORS[index % SYMBOL_RUN_COLORS.length];
}

export function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
