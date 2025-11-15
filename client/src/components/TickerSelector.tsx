import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TickerSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function TickerSelector({
  value = '',
  onChange,
  placeholder = 'Enter ticker (e.g., AAPL)',
}: TickerSelectorProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleBlur = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue !== value) {
      onChange?.(trimmedValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmedValue = inputValue.trim();
      if (trimmedValue !== value) {
        onChange?.(trimmedValue);
      }
      e.currentTarget.blur();
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value.toUpperCase())}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-10 font-mono uppercase"
        data-testid="input-ticker"
      />
    </div>
  );
}
