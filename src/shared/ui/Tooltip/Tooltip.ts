import "./Tooltip.css";
import { TOOLTIP_ARROW_SIZE, computeArrowOffset, computePlacement } from "./position";
import type { TooltipPlacement } from "./position";

interface TooltipOptions {
  text: string | (() => string);
  placement?: TooltipPlacement | (() => TooltipPlacement);
  delay?: number;
}

export interface TooltipHandle {
  detach: () => void;
  refresh: () => void;
  show: () => void;
}

export const TOOLTIP_SHOW_DELAY = 200;
export const TOOLTIP_GRACE_PERIOD = 400;

let lastHideAt = 0;

let tooltipId = 0;

export function attachTooltip(trigger: HTMLElement, options: TooltipOptions): TooltipHandle {
  const delay = options.delay ?? TOOLTIP_SHOW_DELAY;
  let tip: HTMLElement | null = null;
  let label: HTMLElement | null = null;
  let arrow: HTMLElement | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const resolveText = (): string => (typeof options.text === "function" ? options.text() : options.text);

  const resolvePlacement = (): TooltipPlacement =>
    typeof options.placement === "function" ? options.placement() : (options.placement ?? "top");

  const place = (): void => {
    if (!tip || !arrow || !label) {
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const size = tip.getBoundingClientRect();
    const placed = computePlacement(
      { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      { width: size.width, height: size.height },
      { width: window.innerWidth, height: window.innerHeight },
      resolvePlacement(),
    );
    tip.style.left = `${placed.x}px`;
    tip.style.top = `${placed.y}px`;
    tip.dataset.placement = placed.placement;
    const half = TOOLTIP_ARROW_SIZE / 2;
    if (placed.placement === "top" || placed.placement === "bottom") {
      const offset = computeArrowOffset(rect.x + rect.width / 2, placed.x, size.width);
      arrow.style.left = `${offset - half}px`;
      arrow.style.top = "";
    } else {
      const offset = computeArrowOffset(rect.y + rect.height / 2, placed.y, size.height);
      arrow.style.top = `${offset - half}px`;
      arrow.style.left = "";
    }
  };

  const show = (): void => {
    if (tip) {
      return;
    }
    const text = resolveText();
    if (text === "") {
      return;
    }
    tooltipId += 1;
    tip = document.createElement("div");
    tip.className = "tooltip";
    tip.setAttribute("role", "tooltip");
    tip.id = `tooltip-${tooltipId}`;
    label = document.createElement("span");
    label.textContent = text;
    arrow = document.createElement("div");
    arrow.className = "tooltip-arrow";
    arrow.setAttribute("aria-hidden", "true");
    tip.append(label, arrow);
    trigger.setAttribute("aria-describedby", tip.id);
    document.body.append(tip);
    place();
  };

  const hide = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
    if (tip) {
      lastHideAt = Date.now();
    }
    tip?.remove();
    tip = null;
    label = null;
    arrow = null;
    trigger.removeAttribute("aria-describedby");
  };

  const refresh = (): void => {
    if (!tip || !label) {
      return;
    }
    const text = resolveText();
    if (text === "") {
      hide();
      return;
    }
    label.textContent = text;
    place();
  };

  const schedule = (): void => {
    if (tip || timer !== undefined) {
      return;
    }
    const elapsed = Date.now() - lastHideAt;
    if (elapsed >= 0 && elapsed < TOOLTIP_GRACE_PERIOD) {
      show();
      return;
    }
    timer = setTimeout(() => {
      timer = undefined;
      show();
    }, delay);
  };

  const onKey = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      hide();
    }
  };

  trigger.addEventListener("mouseenter", schedule);
  trigger.addEventListener("mouseleave", hide);
  trigger.addEventListener("focus", show);
  trigger.addEventListener("blur", hide);
  trigger.addEventListener("mousedown", hide);
  trigger.addEventListener("click", hide);
  window.addEventListener("keydown", onKey);
  window.addEventListener("scroll", place, true);
  window.addEventListener("resize", place);

  return {
    detach: () => {
      trigger.removeEventListener("mouseenter", schedule);
      trigger.removeEventListener("mouseleave", hide);
      trigger.removeEventListener("focus", show);
      trigger.removeEventListener("blur", hide);
      trigger.removeEventListener("mousedown", hide);
      trigger.removeEventListener("click", hide);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
      hide();
    },
    refresh,
    show,
  };
}
