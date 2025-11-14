export type SettingType = 'enum' | 'numeric';

export interface StrategySetting {
  field: string;
  type: SettingType;
  value: string | number;
  options: string[] | [number, number];
  default: string | number;
}
