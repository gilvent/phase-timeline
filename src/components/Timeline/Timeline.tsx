import { useEffect, useRef, useState } from "react";
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
  const isDraggingOnRuler = useRef<boolean>(false);

  useEffect(() => {
    // on ruler mouse move, Playhead movement is per 1px while PlayControl input increment is per 10px.
    // this flag is to prevent playhead to move by 10px while dragging
    if (!isDraggingOnRuler.current) {
      setPlayheadX(time);
    }
  }, [time]);

  function handleRulerDragging(time: number) {
    isDraggingOnRuler.current = true;

    setTime(roundToNearestPrecision(time, 10));
    setPlayheadX(time);
  }

  function handleRulerMouseDown(time: number) {
    setTime(roundToNearestPrecision(time, 10));
  }

  function handleRulerDraggingEnd() {
    isDraggingOnRuler.current = false;
  }

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls
        time={time}
        setTime={setTime}
        duration={duration}
        setDuration={setDuration}
      />
      <Ruler
        width={duration}
        onMouseDown={handleRulerMouseDown}
        onDragging={handleRulerDragging}
        onDraggingEnd={handleRulerDraggingEnd}
      />
      <TrackList />
      <KeyframeList />
      <Playhead time={playheadX} />
    </div>
  );
};
