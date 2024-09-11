import { useCallback, useEffect, useRef } from "react";
import useScrollSync, { ScrollSyncID } from "../../hooks/useScrollSync";

type RulerProps = {
  width: number;
  onMouseDown: ({
    time,
    playheadX
  }: {
    time: number;
    playheadX: number;
  }) => void;
  onDragging: ({
    time,
    playheadX
  }: {
    time: number;
    playheadX: number;
  }) => void;
  time: number;
  onScroll: ({
    playheadX,
    shouldHidePlayhead
  }: {
    playheadX: number;
    shouldHidePlayhead: boolean;
  }) => void;
};

export const Ruler = ({
  width,
  onMouseDown,
  onDragging,
  onScroll,
  time
}: RulerProps) => {
  // TODO: implement mousedown and mousemove to update time and Playhead position
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const timePosition = useRef<number>(time);
  const isDraggable = useRef<boolean>(false);
  const boundary = useRef({
    left: 0,
    right: 0
  });
  const scroll = useScrollSync({
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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const element = e.target as Element;
      const elementRect = element.getBoundingClientRect();
      const scrollLeft = scroll.current?.left ?? 0;

      isDraggable.current = true;
      boundary.current = {
        left: elementRect.left + scrollLeft,
        right: elementRect.right + scrollLeft
      };
      timePosition.current = e.clientX - boundary.current.left + scrollLeft;

      onMouseDown({
        time: timePosition.current,
        playheadX: timePosition.current - scrollLeft
      });
      enableDragging();
    },
    [onMouseDown]
  );

  function handleDragging(e: MouseEvent) {
    if (!isDraggable.current) {
      return;
    }

    const scrollLeft = scroll.current?.left ?? 0;

    // TODO handle playhead out of boundary

    timePosition.current = e.clientX - boundary.current.left + scrollLeft;

    onDragging({
      time: timePosition.current,
      playheadX: timePosition.current - scrollLeft
    });
  }

  function endDragging() {
    isDraggable.current = false;
    window.removeEventListener("mousemove", handleDragging);
    window.removeEventListener("mouseup", endDragging);
    window.removeEventListener("selectstart", disableSelect);
  }

  function enableDragging() {
    window.addEventListener("mousemove", handleDragging);
    window.addEventListener("mouseup", endDragging);
    window.addEventListener("selectstart", disableSelect);
  }

  function disableSelect(e: Event) {
    e.preventDefault();
  }

  function handleScrollChange(e: Event) {
    const el = e.target as HTMLDivElement;
    const playheadX = timePosition.current + -1 * el.scrollLeft;

    onScroll({
      playheadX,
      shouldHidePlayhead: playheadX < 0
    });
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
        className="w-[2000px] h-6 rounded-md bg-white/25"
        onMouseDown={handleMouseDown}
        style={{ width }}
      ></div>
    </div>
  );
};
