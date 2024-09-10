import { useCallback, useRef } from "react";

type RulerProps = {
  width: number;
  onMouseDown: (time: number) => void;
  onDragging: (time: number) => void;
  onDraggingEnd: () => void;
};

export const Ruler = ({
  width,
  onMouseDown,
  onDragging,
  onDraggingEnd
}: RulerProps) => {
  // TODO: implement mousedown and mousemove to update time and Playhead position
  const rulerRef = useRef(null);
  const isDraggable = useRef<boolean>(false);
  const boundary = useRef({
    left: 0,
    right: 0
  });

  // useEffect(() => {
  //   window.addEventListener("mouseup", endDragging);
  //   window.addEventListener("mousemove", handleDragging);

  //   return () => {
  //     window.removeEventListener("mouseup", endDragging);
  //     window.removeEventListener("mousemove", handleDragging);
  //   };
  // }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const element = e.target as Element;
      const elementRect = element.getBoundingClientRect();

      isDraggable.current = true;
      boundary.current = {
        left: elementRect.left,
        right: elementRect.right
      };

      onMouseDown(e.clientX - boundary.current.left);
      enableDragging();
    },
    [onMouseDown]
  );

  function handleDragging(e: MouseEvent) {
    if (!isDraggable.current) {
      return;
    }

    if (e.clientX < boundary.current.left) {
      onDragging(0);
      return;
    }

    if (e.clientX > boundary.current.right) {
      onDragging(width);
      return;
    }

    requestAnimationFrame(() => {
      onDragging(e.clientX - boundary.current.left);
    });
  }

  function endDragging() {
    isDraggable.current = false;
    onDraggingEnd();

    window.removeEventListener("mousemove", handleDragging);
    window.removeEventListener("mouseup", endDragging);
  }

  function enableDragging() {
    window.addEventListener("mousemove", handleDragging);
    window.addEventListener("mouseup", endDragging);
  }

  return (
    <div
      className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
      data-testid="ruler"
    >
      <div
        ref={rulerRef}
        className="w-[2000px] h-6 rounded-md bg-white/25"
        onMouseDown={handleMouseDown}
        style={{ width }}
      ></div>
    </div>
  );
};
