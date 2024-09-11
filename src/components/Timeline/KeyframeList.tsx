import { useRef } from "react";
import { Segment } from "./Segment";
import useScrollSync, { ScrollSyncID } from "../../hooks/useScrollSync";

export const KeyframeList = () => {
  // TODO: implement scroll sync with `Ruler` and `TrackList`
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useScrollSync({
    id: ScrollSyncID.Keyframe,
    syncTargetId: ScrollSyncID.Ruler,
    nodeRef
  });

  return (
    <div
      ref={nodeRef}
      className="px-4 min-w-0 overflow-auto"
      data-testid="keyframe-list"
    >
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
    </div>
  );
};
