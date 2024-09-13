import { useRef, useState } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";
import { roundToNearestPrecision } from "../../utils/math";
import { CursorRipple } from "./CursorRipple";

export const Timeline = () => {
  // FIXME: performance concerned
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(2000);
  const [playheadX, setPlayheadX] = useState(time);
  const [playheadHidden, setPlayheadHidden] = useState(false);

  function handlePlayControlTimeChange(time: number) {
    setTime(time);
  }

  function handleRulerTimeUpdate(time: number) {
    setTime(roundToNearestPrecision(time, 10));
  }

  function handleRulerPlayheadUpdate(
    xPosition: number,
    isOutOfBounds: boolean
  ) {
    setPlayheadHidden(isOutOfBounds);
    setPlayheadX(xPosition);
  }

  return (
    <div
      ref={nodeRef}
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
        playheadUpdate={handleRulerPlayheadUpdate}
      />
      <TrackList />
      <KeyframeList duration={duration} />
      <Playhead position={playheadX} hidden={playheadHidden} />
      <CursorRipple timelineElRef={nodeRef} />
    </div>
  );
};
