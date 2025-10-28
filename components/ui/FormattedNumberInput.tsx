'use client';

import { useState, useEffect } from 'react';

interface FormattedNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  step?: number;
  min?: number;
  max?: number;
  isDecimal?: boolean;
}

export function FormattedNumberInput({
  value,
  onChange,
  className = '',
  step,
  min,
  max,
  isDecimal = false,
}: FormattedNumberInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      // Format the number with commas when not focused
      if (isDecimal) {
        setDisplayValue(
          new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(value)
        );
      } else {
        setDisplayValue(new Intl.NumberFormat('en-US').format(value));
      }
    }
  }, [value, isFocused, isDecimal]);

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number when focused (without commas for easier editing)
    setDisplayValue(value.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Parse and update the actual value
    const numValue = parseFloat(displayValue.replace(/,/g, '')) || 0;
    onChange(numValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow typing numbers, decimals, and commas
    const newValue = e.target.value.replace(/[^\d.-]/g, '');
    setDisplayValue(newValue);

    // Update value in real-time while typing (not just on blur)
    const numValue = parseFloat(newValue) || 0;
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Submit on Enter
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
      inputMode="decimal"
    />
  );
}
