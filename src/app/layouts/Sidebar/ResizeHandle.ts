import type { View } from "@/shared/lib";
import { isCollapsed, setCollapsed, subscribeCollapse } from "./collapse";
import { DEFAULT_WIDTH, clampWidth, computeLiveWidth, shouldSnapCollapse } from "./width";

const DRAG_THRESHOLD = 4;

export function ResizeHandle(nav: HTMLElement): View {
  const controller = new AbortController();
  let customWidth = DEFAULT_WIDTH;

  const applyCustomWidth = (): void => {
    document.body.style.setProperty("--sidebar-width", `${clampWidth(customWidth, window.innerWidth)}px`);
  };

  const unsubscribeWidth = subscribeCollapse(() => {
    if (isCollapsed()) {
      document.body.style.removeProperty("--sidebar-width");
    } else {
      applyCustomWidth();
    }
  });

  const handle = document.createElement("div");
  handle.className = "sidebar-resize-handle";

  handle.addEventListener("pointerdown", (event) => {
    const wasCollapsed = isCollapsed();
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);

    const startX = event.clientX;

    const move = (moveEvent: PointerEvent): void => {
      if (Math.abs(moveEvent.clientX - startX) < DRAG_THRESHOLD) {
        return;
      }
      document.body.classList.add("resizing");
      const rect = nav.getBoundingClientRect();
      const live = computeLiveWidth(moveEvent.clientX, rect.left, window.innerWidth);
      if (shouldSnapCollapse(live)) {
        if (!isCollapsed()) {
          setCollapsed(true);
        }
      } else {
        customWidth = clampWidth(live, window.innerWidth);
        if (isCollapsed()) {
          setCollapsed(false);
        } else {
          applyCustomWidth();
        }
      }
    };
    const cleanup = (): void => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", cleanup);
      document.body.classList.remove("resizing");
    };
    const up = (upEvent: PointerEvent): void => {
      cleanup();
      if (wasCollapsed && Math.abs(upEvent.clientX - startX) < DRAG_THRESHOLD) {
        setCollapsed(false);
      }
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", cleanup);
  });

  handle.addEventListener("dblclick", () => {
    customWidth = DEFAULT_WIDTH;
    if (!isCollapsed()) {
      applyCustomWidth();
    }
  });

  window.addEventListener(
    "resize",
    () => {
      if (!isCollapsed()) {
        customWidth = clampWidth(customWidth, window.innerWidth);
        applyCustomWidth();
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
