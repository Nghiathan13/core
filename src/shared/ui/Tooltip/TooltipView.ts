import {
  acquireOverlay,
  computeArrowOffset,
  computePlacement,
  TOOLTIP_ARROW_SIZE,
} from "../../lib";
import type { TooltipPlacement } from "./types";

let tooltipId = 0;

export interface TooltipViewParams {
  trigger: HTMLElement;
  text: string;
  getPlacement: () => TooltipPlacement;
}

export interface TooltipViewInstance {
  el: HTMLElement;
  place: () => void;
  setText: (text: string) => void;
  destroy: () => void;
}

export function TooltipView({
  trigger,
  text,
  getPlacement,
}: TooltipViewParams): TooltipViewInstance {
  tooltipId += 1;

  const tip = document.createElement("div");
  tip.className = "tooltip";
  tip.setAttribute("role", "tooltip");
  tip.id = `tooltip-${tooltipId}`;

  const overlayHandle = acquireOverlay({
    id: tip.id,
    tier: "tooltip",
    onDismiss: () => destroy(),
  });
  tip.style.zIndex = String(overlayHandle.zIndex);

  const label = document.createElement("span");
  label.textContent = text;

  const arrow = document.createElement("div");
  arrow.className = "tooltip-arrow";
  arrow.setAttribute("aria-hidden", "true");

  tip.append(label, arrow);
  trigger.setAttribute("aria-describedby", tip.id);
  document.body.append(tip);

  const place = (): void => {
    const rect = trigger.getBoundingClientRect();
    const size = tip.getBoundingClientRect();
    const placed = computePlacement(
      { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      { width: size.width, height: size.height },
      { width: window.innerWidth, height: window.innerHeight },
      getPlacement(),
    );

    tip.style.left = `${placed.x}px`;
    tip.style.top = `${placed.y}px`;
    tip.dataset.placement = placed.placement;

    const half = TOOLTIP_ARROW_SIZE / 2;
    if (placed.placement === "top" || placed.placement === "bottom") {
      const offset = computeArrowOffset(
        rect.x + rect.width / 2,
        placed.x,
        size.width,
      );
      arrow.style.left = `${offset - half}px`;
      arrow.style.top = "";
    } else {
      const offset = computeArrowOffset(
        rect.y + rect.height / 2,
        placed.y,
        size.height,
      );
      arrow.style.top = `${offset - half}px`;
      arrow.style.left = "";
    }
  };

  place();

  const setText = (nextText: string): void => {
    label.textContent = nextText;
    place();
  };

  const destroy = (): void => {
    overlayHandle.release();
    tip.remove();
    trigger.removeAttribute("aria-describedby");
  };

  return {
    el: tip,
    place,
    setText,
    destroy,
  };
}
