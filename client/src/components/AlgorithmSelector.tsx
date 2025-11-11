import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Algorithm {
  id: string;
  name: string;
  description?: string;
}

interface AlgorithmSelectorProps {
  algorithms: Algorithm[];
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
      <SelectTrigger className="w-full" data-testid="select-algorithm">
        <SelectValue placeholder="Select an algorithm" />
      </SelectTrigger>
      <SelectContent>
        {algorithms.map((algo) => (
          <SelectItem key={algo.id} value={algo.id} data-testid={`option-algorithm-${algo.id}`}>
            <div>
              <div className="font-medium">{algo.name}</div>
              {algo.description && (
                <div className="text-xs text-muted-foreground">{algo.description}</div>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
