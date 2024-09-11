import { useState } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";
import { roundToNearestPrecision } from "../../utils/math";

export const Timeline = () => {
  // FIXME: performance concerned
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(2000);
  const [playheadX, setPlayheadX] = useState(time);

  function handlePlayControlTimeChange(time: number) {
    setTime(time);
  }

  function handleRulerTimeUpdate(time: number) {
    setTime(roundToNearestPrecision(time, 10));
  }

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls
        time={time}
        duration={duration}
        onTimeChange={handlePlayControlTimeChange}
        onDurationChange={setDuration}
      />
      <Ruler
        width={duration}
        time={time}
        timeUpdate={handleRulerTimeUpdate}
        playheadUpdate={setPlayheadX}
      />
      <TrackList />
      <KeyframeList />
      <Playhead position={playheadX} />
    </div>
  );
};
