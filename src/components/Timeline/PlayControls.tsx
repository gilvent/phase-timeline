import { useCallback } from "react";
import { NumberInput } from "./NumberInput";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
};

export const PlayControls = ({
  time,
  setTime,
  duration,
  setDuration
}: PlayControlsProps) => {
  // TODO: implement time <= maxTime

  const onTimeChange = useCallback(
    (val: number) => {
      setTime(val);
    },
    [setTime]
  );

  const onDurationChange = useCallback(
    (val: number) => {
      if (val < time) {
        setTime(val);
      }
      setDuration(val);
    },
    [setTime, setDuration, time]
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
          onChange={onTimeChange}
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
          min={0}
          max={6000}
          onChange={onDurationChange}
        />
        Duration
      </fieldset>
    </div>
  );
};
