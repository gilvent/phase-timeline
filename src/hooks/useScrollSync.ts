import { RefObject, useEffect, useRef } from "react";

export enum ScrollSyncID {
  KeyframeList = "keyframe-list",
  Ruler = "ruler",
  TrackList = "track-list"
}

// TODO add support for vertical and both
export enum ScrollSyncType {
  Horizontal = "horizontal",
  Vertical = "vertical"
}

type HookProps = {
  nodeRef: RefObject<HTMLElement | null>;
  id: ScrollSyncID;
  syncTargetId: ScrollSyncID;
  type?: ScrollSyncType;
};

export type ElementScroll = {
  top: number;
  left: number;
};

export default function useScrollSync({
  nodeRef,
  id,
  syncTargetId,
  type = ScrollSyncType.Vertical
}: HookProps): RefObject<ElementScroll> {
  const elementScroll = useRef<ElementScroll>({
    top: 0,
    left: 0
  });
  const scrollSyncHandlerByType: Record<
    ScrollSyncType,
    (e: CustomEvent) => void
  > = {
    [ScrollSyncType.Horizontal]: syncHorizontalScroll,
    [ScrollSyncType.Vertical]: syncVerticalScroll
  };

  useEffect(() => {
    nodeRef.current?.addEventListener("scroll", dispatchScrollEvent);

    return () => {
      nodeRef.current?.removeEventListener("scroll", dispatchScrollEvent);
    };
  }, []);

  useEffect(() => {
    const scrollSyncHandler = scrollSyncHandlerByType[type] as (
      e: Event
    ) => void;

    window.addEventListener(scrollEventName(syncTargetId), scrollSyncHandler);

    return () => {
      window.removeEventListener(
        scrollEventName(syncTargetId),
        scrollSyncHandler
      );
    };
  }, []);

  function scrollEventName(id: ScrollSyncID): string {
    return `${id}-scroll-sync`;
  }

  function dispatchScrollEvent(e: Event) {
    const element = e.target as Element;
    const event = new CustomEvent(scrollEventName(id), {
      detail: {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      }
    });

    elementScroll.current = {
      top: element.scrollTop,
      left: element.scrollLeft
    };

    window.dispatchEvent(event);
  }

  function syncHorizontalScroll(e: CustomEvent) {
    if (!nodeRef.current) {
      return;
    }
    nodeRef.current.scrollLeft = e.detail.scrollLeft;
    elementScroll.current.left = e.detail.scrollLeft;
  }

  function syncVerticalScroll(e: CustomEvent) {
    if (!nodeRef.current) {
      return;
    }
    nodeRef.current.scrollTop = e.detail.scrollTop;
    elementScroll.current.top = e.detail.scrollTop;
  }

  return elementScroll;
}
