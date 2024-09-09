import React, { useEffect, useRef, useState } from "react";
import { roundToNearestPrecision } from "../../utils/math";
import classNames from "classnames";

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
  const elementRef = useRef<HTMLInputElement | null>(null);
  const specialKeyActions: Record<
    string,
    (e: React.KeyboardEvent<HTMLInputElement>) => void
  > = {
    Enter: handleEnterKey,
    Escape: handleEscapeKey
  };

  useEffect(() => {
    setCurrentValue(originalValue.toString());
  }, [originalValue]);

  function handleFocus() {
    selectAllInputText();
  }

  function handleBlur() {
    applyValue(currentValue);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isChangedByStepButton(e)) {
      // FIXME: When using native step button / native arrow up and down key handler
      //  -> Enter -> Click on the input field -> Does not reselect the field
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
      finalValue = originalValue;
    } else if (finalValue < min) {
      finalValue = min;
    } else if (finalValue > max) {
      finalValue = max;
    } else {
      finalValue = roundToNearestPrecision(finalValue, STEP);
    }

    setCurrentValue(finalValue.toString());
    onChange(finalValue);
  }

  function handleSpecialKey(e: React.KeyboardEvent<HTMLInputElement>) {
    specialKeyActions[e.key]?.(e);
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

  function isValidInput() {
    if (currentValue.length > 1 && currentValue.charAt(0) === "0") return false;
    if (currentValue.match(/[^0-9]/)) return false;

    const value = parseInt(currentValue);
    return value <= max && value >= min;
  }

  return (
    <input
      ref={elementRef}
      className={classNames("bg-gray-700", "px-1", "rounded", {
        "text-rose-500": !isValidInput()
      })}
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
