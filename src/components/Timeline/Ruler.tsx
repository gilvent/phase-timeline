import { useEffect, useRef } from "react";
import useScrollSync, {
  ScrollSyncID,
  ScrollSyncType
} from "../../hooks/useScrollSync";

type RulerProps = {
  width: number;
  time: number;
  timeUpdate: (time: number) => void;
  playheadUpdate: (xPos: number, isOutOfBounds: boolean) => void;
};

export const Ruler = ({
  width,
  time,
  timeUpdate,
  playheadUpdate
}: RulerProps) => {
  // TODO: implement mousedown and mousemove to update time and Playhead position
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const rulerBarRef = useRef<HTMLDivElement | null>(null);
  const isDraggable = useRef<boolean>(false);
  const scrollLeft = useRef<number>(0);
  const rulerBarRect = useRef<DOMRect | null>(null);
  const rulerRect = useRef<{
    left: number;
    right: number;
  }>({
    left: 0,
    right: 0
  });
  const dragBounds = useRef({
    left: 0,
    right: 0
  });

  useScrollSync({
    id: ScrollSyncID.Ruler,
    syncTargetId: ScrollSyncID.KeyframeList,
    nodeRef,
    type: ScrollSyncType.Horizontal
  });

  useEffect(() => {
    initComponent();
  }, []);

  useEffect(() => {
    if (!isDraggable.current) {
      playheadUpdate(time - scrollLeft.current, isOutOfBounds(time));
    }
  }, [time]);

  useEffect(() => {
    nodeRef.current?.addEventListener("scroll", handleScrollChange);

    return () => {
      nodeRef.current?.removeEventListener("scroll", handleScrollChange);
    };
  }, [time]);


  function initComponent() {
    if (!nodeRef.current || !rulerBarRef.current) return;

    nodeRef.current.scrollLeft = 0;
    rulerRect.current = nodeRef.current.getBoundingClientRect();
    rulerBarRect.current = rulerBarRef.current.getBoundingClientRect();

    dragBounds.current = updatedDragBounds(rulerBarRect.current);
  }

  function handleScrollChange(e: Event) {
    if (!rulerBarRef.current) return;
    const el = e.target as HTMLDivElement;

    rulerBarRect.current = rulerBarRef.current.getBoundingClientRect();
    scrollLeft.current = el.scrollLeft;
    dragBounds.current = updatedDragBounds(rulerBarRect.current);
    
    playheadUpdate(time - scrollLeft.current, isOutOfBounds(time));
  }

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    const rulerBar = e.target as Element;
    const rect = rulerBar.getBoundingClientRect();
    const updatedTime = e.clientX - rect.left;

    rulerBarRect.current = rect;
    isDraggable.current = true;
    dragBounds.current = updatedDragBounds(rulerBarRect.current);

    timeUpdate(updatedTime);
    playheadUpdate(updatedTime - scrollLeft.current, false);
    enableDragging();
  }

  function handleDragging(e: MouseEvent) {
    e.preventDefault();
    if (!isDraggable.current) {
      return;
    }
    let updatedTime;

    if (e.clientX <= dragBounds.current.left) {
      updatedTime = dragBounds.current.left - rulerBarRect.current!.left;
    } else if (e.clientX >= dragBounds.current.right) {
      updatedTime = dragBounds.current.right - rulerBarRect.current!.left;
    } else {
      updatedTime = e.clientX - rulerBarRect.current!.left;
    }

    timeUpdate(updatedTime);
    playheadUpdate(updatedTime - scrollLeft.current, false);
  }

  function enableDragging() {
    isDraggable.current = true;
    window.addEventListener("mousemove", handleDragging);
    window.addEventListener("mouseup", endDragging);
    window.addEventListener("selectstart", disableSelect);
  }

  function endDragging() {
    isDraggable.current = false;
    window.removeEventListener("mousemove", handleDragging);
    window.removeEventListener("mouseup", endDragging);
    window.removeEventListener("selectstart", disableSelect);
  }

  function disableSelect(e: Event) {
    e.preventDefault();
  }

  function isOutOfBounds(time: number): boolean {
    if (!rulerBarRect.current) return false
    return (
      time + rulerBarRect.current.left < dragBounds.current.left ||
      time + rulerBarRect.current.left > dragBounds.current.right
    );
  }

  function updatedDragBounds(rulerBarRect: DOMRect) {
    return {
      left:
        rulerBarRect.left >= rulerRect.current.left
          ? rulerBarRect.left
          : rulerRect.current.left,
      right:
        rulerBarRect.right <= rulerRect.current.right
          ? rulerBarRect.right
          : rulerRect.current.right
    };
  }

  return (
    <div
      ref={nodeRef}
      className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
      data-testid="ruler"
    >
      <div
        data-testid="ruler-bar"
        ref={rulerBarRef}
        className="w-[2000px] h-6 rounded-md bg-white/25"
        onMouseDown={handleMouseDown}
        style={{ width }}
      ></div>
    </div>
  );
};
