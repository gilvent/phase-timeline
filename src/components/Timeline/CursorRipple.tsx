import classNames from "classnames";
import { RefObject, useEffect, useRef, useState } from "react";

type CursorRippleProps = {
  timelineElRef: RefObject<HTMLDivElement | null>;
};

export const CursorRipple = ({ timelineElRef }: CursorRippleProps) => {
  const rippleRef = useRef<HTMLDivElement | null>(null);
  const [animation, setAnimation] = useState<"enter" | "exit" | "none">("none");
  const animationClassByState: Record<string, string> = {
    enter: "animate-[cursor-ripple-in_150ms_linear_forwards]",
    exit: "animate-[cursor-ripple-out_150ms_linear_forwards]"
  };

  useEffect(() => {
    timelineElRef.current?.addEventListener("mousedown", handleMouseDown);

    return () => {
      timelineElRef.current?.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  function handleMouseDown(e: MouseEvent) {
    updatePosition(e);
    enableDragging();
    setAnimation("enter");
  }

  function handleDragging(e: MouseEvent) {
    updatePosition(e);
  }

  function enableDragging() {
    window.addEventListener("mousemove", handleDragging);
    window.addEventListener("mouseup", endDragging);
  }

  function endDragging() {
    setAnimation("exit");
    window.removeEventListener("mousemove", handleDragging);
    window.removeEventListener("mouseup", endDragging);
  }

  function updatePosition(e: MouseEvent) {
    if (!rippleRef.current) return;
    const width = rippleRef.current.offsetWidth;
    const height = rippleRef.current.offsetHeight;

    rippleRef.current.style.left = `${e.pageX - width / 2}px`;
    rippleRef.current.style.top = `${e.pageY - height / 2}px`;
  }

  return (
    <div
      ref={rippleRef}
      className={classNames(
        "fixed top-0 left-0 py-2 w-[30px] h-[30px] opacity-0 rounded-full border-blue-500 border-2 pointer-events-none",
        animationClassByState[animation]
      )}
    ></div>
  );
};
