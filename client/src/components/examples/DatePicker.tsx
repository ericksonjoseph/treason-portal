import { useState } from 'react';
import DatePicker from '../DatePicker';

export default function DatePickerExample() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="w-80 space-y-4">
      <DatePicker date={date} onDateChange={setDate} label="Pick a date" />
      {date && (
        <p className="text-sm text-muted-foreground">
          Selected: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
