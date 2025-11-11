import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Traitor } from '@/types/traitor';

interface AlgorithmSelectorProps {
  algorithms: Traitor[];
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
      <SelectTrigger className="w-full" data-testid="select-traitor">
        <SelectValue placeholder="Select a traitor" />
      </SelectTrigger>
      <SelectContent>
        {algorithms.map((traitor) => (
          <SelectItem key={traitor.id} value={traitor.id} data-testid={`option-traitor-${traitor.id}`}>
            <div>
              <div className="font-medium">{traitor.name}</div>
              {traitor.description && (
                <div className="text-xs text-muted-foreground">{traitor.description}</div>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
