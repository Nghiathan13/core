import type { View } from "@/shared/lib";
import { isCollapsed, setCollapsed, subscribeCollapse } from "./collapse";
import { DEFAULT_WIDTH, clampWidth, computeLiveWidth, shouldSnapCollapse } from "./width";

const DRAG_THRESHOLD = 4;

export function ResizeHandle(nav: HTMLElement): View {
  const controller = new AbortController();
  let preferredWidth = DEFAULT_WIDTH;

  const applyWidth = (): void => {
    document.body.style.setProperty("--sidebar-width", `${clampWidth(preferredWidth, window.innerWidth)}px`);
  };

  const unsubscribeWidth = subscribeCollapse(() => {
    if (isCollapsed()) {
      document.body.style.removeProperty("--sidebar-width");
    } else {
      applyWidth();
    }
  });

  const handle = document.createElement("div");
  handle.className = "sidebar-resize-handle";

  handle.addEventListener("pointerdown", (event) => {
    const wasCollapsed = isCollapsed();
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const rectLeft = nav.getBoundingClientRect().left;
    let latestX = startX;
    let frame: number | undefined;
    let dragging = false;

    const applyMove = (): void => {
      frame = undefined;
      const viewportWidth = window.innerWidth;
      const live = computeLiveWidth(latestX, rectLeft, viewportWidth);
      if (shouldSnapCollapse(live)) {
        if (!isCollapsed()) {
          setCollapsed(true);
        }
        return;
      }
      const next = clampWidth(live, viewportWidth);
      if (isCollapsed()) {
        preferredWidth = next;
        setCollapsed(false);
        return;
      }
      if (next !== preferredWidth) {
        preferredWidth = next;
        applyWidth();
      }
    };

    const move = (moveEvent: PointerEvent): void => {
      latestX = moveEvent.clientX;
      if (Math.abs(latestX - startX) < DRAG_THRESHOLD) {
        return;
      }
      if (!dragging) {
        dragging = true;
        document.body.classList.add("resizing");
      }
      frame ??= requestAnimationFrame(applyMove);
    };
    const cleanup = (): void => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", cancel);
      document.body.classList.remove("resizing");
    };
    const cancel = (): void => {
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
        frame = undefined;
      }
      cleanup();
    };
    const flush = (): void => {
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
        frame = undefined;
        applyMove();
      }
    };
    const up = (upEvent: PointerEvent): void => {
      latestX = upEvent.clientX;
      flush();
      cleanup();
      if (wasCollapsed && Math.abs(upEvent.clientX - startX) < DRAG_THRESHOLD) {
        setCollapsed(false);
      }
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", cancel);
  });

  handle.addEventListener("dblclick", () => {
    preferredWidth = DEFAULT_WIDTH;
    if (!isCollapsed()) {
      applyWidth();
    }
  });

  window.addEventListener(
    "resize",
    () => {
      if (!isCollapsed()) {
        applyWidth();
      }
    },
    { signal: controller.signal },
  );

  return {
    el: handle,
    destroy: () => {
      controller.abort();
      unsubscribeWidth();
    },
  };
}
