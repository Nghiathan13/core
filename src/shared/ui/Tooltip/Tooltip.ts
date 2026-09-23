import "./Tooltip.css";
import { computePlacement } from "./position";
import type { TooltipPlacement } from "./position";

interface TooltipOptions {
  text: string | (() => string);
  placement?: TooltipPlacement | (() => TooltipPlacement);
}

export interface TooltipHandle {
  detach: () => void;
  refresh: () => void;
}

let tooltipId = 0;

export function attachTooltip(trigger: HTMLElement, options: TooltipOptions): TooltipHandle {
  let tip: HTMLElement | null = null;

  const resolveText = (): string => (typeof options.text === "function" ? options.text() : options.text);

  const resolvePlacement = (): TooltipPlacement =>
    typeof options.placement === "function" ? options.placement() : (options.placement ?? "top");

  const place = (): void => {
    if (!tip) {
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
    tip.textContent = text;
    trigger.setAttribute("aria-describedby", tip.id);
    document.body.append(tip);
    place();
  };

  const hide = (): void => {
    tip?.remove();
    tip = null;
    trigger.removeAttribute("aria-describedby");
  };

  const refresh = (): void => {
    if (!tip) {
      return;
    }
    const text = resolveText();
    if (text === "") {
      hide();
      return;
    }
    tip.textContent = text;
    place();
  };

  const onKey = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      hide();
    }
  };

  trigger.addEventListener("mouseenter", show);
  trigger.addEventListener("mouseleave", hide);
  trigger.addEventListener("focus", show);
  trigger.addEventListener("blur", hide);
  window.addEventListener("keydown", onKey);
  window.addEventListener("scroll", place, true);
  window.addEventListener("resize", place);

  return {
    detach: () => {
      trigger.removeEventListener("mouseenter", show);
      trigger.removeEventListener("mouseleave", hide);
      trigger.removeEventListener("focus", show);
      trigger.removeEventListener("blur", hide);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
      hide();
    },
    refresh,
  };
}
