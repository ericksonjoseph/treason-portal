import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TickerSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function TickerSelector({
  value,
  onChange,
  placeholder = 'Enter ticker (e.g., AAPL)',
}: TickerSelectorProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value.toUpperCase())}
        placeholder={placeholder}
        className="pl-10 font-mono uppercase"
        data-testid="input-ticker"
      />
    </div>
  );
}
