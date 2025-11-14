import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import type { StrategySetting } from '@/types/settings';

interface StrategySettingsProps {
  settings: StrategySetting[];
  onSettingChange?: (field: string, value: string | number) => void;
  onBack?: () => void;
}

export default function StrategySettings({
  settings,
  onSettingChange,
  onBack,
}: StrategySettingsProps) {
  const handleEnumChange = (field: string, value: string) => {
    onSettingChange?.(field, value);
  };

  const handleNumericChange = (field: string, value: number[]) => {
    onSettingChange?.(field, value[0]);
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto p-4">
      <Card data-testid="card-settings">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Strategy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {settings.map((setting) => (
            <div key={setting.field} className="space-y-2">
              <Label className="text-sm font-medium capitalize">
                {setting.field}
              </Label>
              
              {setting.type === 'enum' && Array.isArray(setting.options) && (
                <Select
                  value={String(setting.value)}
                  onValueChange={(value) => handleEnumChange(setting.field, value)}
                >
                  <SelectTrigger data-testid={`select-${setting.field.replace(/\s+/g, '-')}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(setting.options as string[]).map((option) => (
                      <SelectItem 
                        key={option} 
                        value={option}
                        data-testid={`option-${option}`}
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {setting.type === 'numeric' && Array.isArray(setting.options) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {setting.options[0]}
                    </span>
                    <span className="text-sm font-medium">
                      {setting.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {setting.options[1]}
                    </span>
                  </div>
                  <Slider
                    value={[Number(setting.value)]}
                    min={setting.options[0] as number}
                    max={setting.options[1] as number}
                    step={1}
                    onValueChange={(value) => handleNumericChange(setting.field, value)}
                    data-testid={`slider-${setting.field.replace(/\s+/g, '-')}`}
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button
              onClick={onBack}
              variant="outline"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
