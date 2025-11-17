import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Strategy } from '@/types/strategy';

interface AlgorithmSelectorProps {
  algorithms: Strategy[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function AlgorithmSelector({
  algorithms,
  value,
  onValueChange,
}: AlgorithmSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full" data-testid="select-strategy">
        <SelectValue placeholder="Select a strategy" />
      </SelectTrigger>
      <SelectContent>
        {algorithms.map((strategy) => (
          <SelectItem key={strategy.id} value={strategy.id} data-testid={`option-strategy-${strategy.id}`}>
            <div>
              <div className="font-medium">{strategy.name}</div>
              {strategy.createdBy && (
                <div className="text-xs text-muted-foreground">Created by: {strategy.createdBy}</div>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
