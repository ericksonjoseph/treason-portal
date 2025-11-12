export type SettingType = 'enum' | 'numeric';

export interface TraitorSetting {
  field: string;
  type: SettingType;
  value: string | number;
  options: string[] | [number, number];
  default: string | number;
}
