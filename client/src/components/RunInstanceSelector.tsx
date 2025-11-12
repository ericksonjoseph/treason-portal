import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RunInstance } from '@/types/traitor';

interface RunInstanceSelectorProps {
  instances: RunInstance[];
  value?: string;
  onValueChange?: (value: string) => void;
  onDelete?: (instanceId: string) => void;
  disabled?: boolean;
}

export default function RunInstanceSelector({
  instances,
  value,
  onValueChange,
  onDelete,
  disabled = false,
}: RunInstanceSelectorProps) {
  const handleDelete = (e: React.MouseEvent, instanceId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(instanceId);
  };
  if (instances.length === 0) {
    return null;
  }

  if (instances.length === 1) {
    return (
      <div 
        className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md bg-muted/50"
        data-testid="text-run-single"
      >
        <Clock className="w-4 h-4" />
        <span>Single run at {instances[0].timestamp}</span>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full" data-testid="select-run-instance">
        <SelectValue placeholder="Select run instance" />
      </SelectTrigger>
      <SelectContent>
        {instances.map((instance) => (
          <SelectItem 
            key={instance.id} 
            value={instance.id}
            data-testid={`option-run-${instance.id}`}
          >
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="font-medium">Run #{instance.runNumber}</span>
                <span className="text-xs text-muted-foreground">{instance.timestamp}</span>
                {instance.status && (
                  <span 
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      instance.status === 'completed' 
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : instance.status === 'running'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {instance.status}
                  </span>
                )}
              </div>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2 hover-elevate"
                  onClick={(e) => handleDelete(e, instance.id)}
                  data-testid={`button-delete-run-${instance.id}`}
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </Button>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
