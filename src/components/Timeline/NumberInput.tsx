import React, { useRef, useState } from "react";
import { roundToNearestPrecision } from "../../utils/math";

type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  max: number;
  min: number;
  dataTestId?: string;
};

const STEP = 10;

export const NumberInput = ({
  value: originalValue,
  onChange,
  dataTestId,
  min,
  max
}: NumberInputProps) => {
  // TODO: implement time <= maxTime
  const [currentValue, setCurrentValue] = useState<string>(
    originalValue.toString() ?? 0
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const elementRef = useRef<HTMLInputElement | null>(null);
  const keyboardActions: Record<
    string,
    (e: React.KeyboardEvent<HTMLInputElement>) => void
  > = {
    Enter: handleEnterKey,
    Escape: handleEscapeKey
  };

  function handleFocus() {
    setIsFocused(true);
    selectAllInputText();
  }

  function handleBlur() {
    applyValue(currentValue);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (isChangedByStepButton(e)) {
      // FIXME: When using step button -> Enter -> Click on the input field does not reselect the field
      selectAllInputText();
      applyValue(e.target.value);
      return;
    }

    setCurrentValue(e.target.value);
  }

  // FIXME: This approach still return false when current value is not multiple of steps (e.g 123)
  function isChangedByStepButton(
    e: React.ChangeEvent<HTMLInputElement>
  ): boolean {
    return Math.abs(parseInt(currentValue) - parseInt(e.target.value)) === STEP;
  }

  function selectAllInputText() {
    elementRef.current?.select();
  }

  function applyValue(value: string) {
    let finalValue: number = parseInt(value);

    if (!value) {
      // TODO: implement previous valid value instead of original value
      finalValue = originalValue;
    } else if (finalValue < 0) {
      finalValue = min;
    } else {
      finalValue = roundToNearestPrecision(finalValue, STEP);
    }

    setCurrentValue(Number(finalValue).toString());
    onChange(finalValue);
  }

  function handleSpecialKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isFocused) return;

    keyboardActions[e.key]?.(e);
  }

  function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    elementRef.current?.blur();
    applyValue(currentValue);
  }

  function handleEscapeKey(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    elementRef.current?.blur();
    applyValue(originalValue.toString() ?? 0);
  }

  return (
    <input
      ref={elementRef}
      className="bg-gray-700 px-1 rounded"
      type="number"
      data-testid={dataTestId}
      min={min}
      max={max}
      step={STEP}
      value={currentValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleSpecialKey}
    />
  );
};
