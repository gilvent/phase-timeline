import { useCallback, useEffect, useRef } from "react";
import useScrollSync, { ScrollSyncID } from "../../hooks/useScrollSync";

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
  const draggableAreaRef = useRef<HTMLDivElement | null>(null);
  const timePosition = useRef<number>(time);
  const isDraggable = useRef<boolean>(false);
  const scrollLeft = useRef<number>(0);
  const draggableAreaLeft = useRef<number>(0);

  const visibleBounds = useRef({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  });

  useScrollSync({
    id: ScrollSyncID.Ruler,
    syncTargetId: ScrollSyncID.Keyframe,
    nodeRef
  });

  useEffect(() => {
    nodeRef.current?.addEventListener("scroll", handleScrollChange);

    return () => {
      nodeRef.current?.removeEventListener("scroll", handleScrollChange);
    };
  }, []);

  useEffect(() => {
    timePosition.current = time;
    if (!isDraggable.current) {
      playheadUpdate(
        timePosition.current - scrollLeft.current,
        isOutOfBounds()
      );
    }
  }, [time]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const draggableArea = e.target as Element;
      const draggableAreaRect = draggableArea.getBoundingClientRect();
      const outerAreaRect = nodeRef.current?.getBoundingClientRect() ?? {
        left: 0,
        right: 0
      };

      visibleBounds.current = {
        left:
          draggableAreaRect.left >= outerAreaRect.left
            ? draggableAreaRect.left
            : outerAreaRect.left,
        right:
          draggableAreaRect.right <= outerAreaRect.right
            ? draggableAreaRect.right
            : outerAreaRect.right,
        top: draggableAreaRect.top,
        bottom: draggableAreaRect.bottom
      };

      isDraggable.current = true;
      timePosition.current = e.clientX - draggableAreaRect.left;
      draggableAreaLeft.current = draggableAreaRect.left;

      timeUpdate(timePosition.current);
      playheadUpdate(timePosition.current - scrollLeft.current, false);

      enableDragging();
    },
    [timeUpdate, playheadUpdate]
  );

  const handleDragging = useCallback(
    (e: MouseEvent) => {
      if (!isDraggable.current) {
        return;
      }

      if (e.clientX <= visibleBounds.current.left) {
        timePosition.current =
          visibleBounds.current.left - draggableAreaLeft.current;
        timeUpdate(timePosition.current);
        playheadUpdate(timePosition.current - scrollLeft.current, false);
        return;
      }

      if (e.clientX >= visibleBounds.current.right) {
        timePosition.current =
          visibleBounds.current.right - draggableAreaLeft.current;
        timeUpdate(timePosition.current);
        playheadUpdate(timePosition.current - scrollLeft.current, false);
        return;
      }

      timePosition.current = e.clientX - draggableAreaLeft.current;
      timeUpdate(timePosition.current);
      playheadUpdate(timePosition.current - scrollLeft.current, false);
    },
    [timeUpdate, playheadUpdate]
  );

  function enableDragging() {
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

  function handleScrollChange(e: Event) {
    const el = e.target as HTMLDivElement;
    scrollLeft.current = el.scrollLeft;

    playheadUpdate(timePosition.current - scrollLeft.current, isOutOfBounds());
  }

  function isOutOfBounds() {
    const draggableArea = draggableAreaRef.current?.getBoundingClientRect() ?? {
      left: 0,
      right: 0
    };
    const outerAreaRect = nodeRef.current?.getBoundingClientRect() ?? {
      left: 0,
      right: 0
    };

    return (
      timePosition.current + draggableArea.left < outerAreaRect.left ||
      timePosition.current + draggableArea.left > outerAreaRect.right
    );
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
        ref={draggableAreaRef}
        className="w-[2000px] h-6 rounded-md bg-white/25"
        onMouseDown={handleMouseDown}
        style={{ width }}
      ></div>
    </div>
  );
};
