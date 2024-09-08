import React, { useEffect, useRef, useState } from "react";
// import usePreviousState from "../../hooks/usePreviousState.hook";

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

  useEffect(() => {
    elementRef.current?.addEventListener("focusin", onFocusIn);

    return () => {
      elementRef.current?.removeEventListener("focusin", onFocusIn);
    };
  });

  useEffect(() => {
    elementRef.current?.addEventListener("focusout", onFocusOut);

    return () => {
      elementRef.current?.removeEventListener("focusout", onFocusOut);
    };
  });

  function onFocusIn() {
    selectAllInputText();
  }

  function onFocusOut() {
    applyValue(currentValue);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isChangedByStepButton(e)) {
      selectAllInputText();
      applyValue(e.target.value);
      return;
    }

    // TODO: implement key handler
    setCurrentValue(e.target.value);
  }

  function isChangedByStepButton(e: React.ChangeEvent<HTMLInputElement>) {
    return Math.abs(parseInt(currentValue) - parseInt(e.target.value)) === STEP;
  }

  function selectAllInputText() {
    elementRef.current?.select();
  }

  function applyValue(value: string) {
    let finalValue: number = parseInt(value);

    if (!value) {
      finalValue = originalValue;
    } else if (finalValue < 0) {
      finalValue = min;
    } else {
      finalValue = Math.round(finalValue);
    }

    setCurrentValue(Number(finalValue).toString());
    onChange(finalValue);
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
    />
  );
};
