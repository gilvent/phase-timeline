import { useCallback } from "react";
import { NumberInput } from "./NumberInput";

type PlayControlsProps = {
  time: number;
  onTimeChange: (time: number) => void;
  duration: number;
  onDurationChange: (duration: number) => void;
};

export const PlayControls = ({
  time,
  onTimeChange,
  duration,
  onDurationChange
}: PlayControlsProps) => {
  // TODO: implement time <= maxTime

  const handleTimeInputChange = useCallback(
    (val: number) => {
      onTimeChange(val);
    },
    [onTimeChange]
  );

  const handleDurationInputChange = useCallback(
    (val: number) => {
      if (val <= time) {
        onTimeChange(val);
      }
      onDurationChange(val);
    },
    [onTimeChange, onDurationChange, time]
  );

  return (
    <div
      className="flex items-center justify-between border-b border-r border-solid border-gray-700 
 px-2"
      data-testid="play-controls"
    >
      <fieldset className="flex gap-1">
        Current
        <NumberInput
          value={time}
          onChange={handleTimeInputChange}
          dataTestId="time"
          min={0}
          max={duration}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <NumberInput
          value={duration}
          dataTestId="max-time"
          min={100}
          max={6000}
          onChange={handleDurationInputChange}
        />
        Duration
      </fieldset>
    </div>
  );
};
