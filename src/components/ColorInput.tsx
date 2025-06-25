
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorInput: React.FC<ColorInputProps> = ({ value, onChange, className }) => {
  // Ensure the color value includes the # prefix
  const normalizedValue = value.startsWith('#') ? value : `#${value}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        type="color"
        value={normalizedValue}
        onChange={handleChange}
        className="w-12 h-10 rounded border cursor-pointer"
      />
      <Input
        type="text"
        value={normalizedValue}
        onChange={handleChange}
        placeholder="#000000"
        className="flex-1 font-mono"
      />
    </div>
  );
};
