import { useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  allLabel?: string;
  testId?: string;
}

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select items',
  allLabel = 'All',
  testId = 'multiselect',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const isAllSelected = selected.length === 0 || selected.length === options.length;

  const toggleAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(options.map((opt) => opt.value));
    }
  };

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const getDisplayText = () => {
    if (isAllSelected) {
      return allLabel;
    }
    if (selected.length === 1) {
      return options.find((opt) => opt.value === selected[0])?.label || placeholder;
    }
    return `${selected.length} selected`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          data-testid={`${testId}-trigger`}
        >
          <span className="truncate">{getDisplayText()}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={toggleAll}
              data-testid={`${testId}-all`}
            >
              <Check className={`mr-1 h-3 w-3 ${isAllSelected ? 'opacity-100' : 'opacity-0'}`} />
              {allLabel}
            </Button>
            {!isAllSelected && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={clearAll}
                data-testid={`${testId}-clear`}
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
          <Separator />
          <div className="mt-2 max-h-64 overflow-y-auto">
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <Button
                  key={option.value}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start mb-1"
                  onClick={() => toggleOption(option.value)}
                  data-testid={`${testId}-option-${option.value}`}
                >
                  <Check className={`mr-2 h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  <span className="truncate">{option.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
