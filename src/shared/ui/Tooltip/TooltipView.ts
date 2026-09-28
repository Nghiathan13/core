import { acquireOverlay, setupTooltipPosition } from "../../lib";
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

  const positionController = setupTooltipPosition(
    trigger,
    tip,
    arrow,
    getPlacement,
  );

  const setText = (nextText: string): void => {
    label.textContent = nextText;
    void positionController.reposition();
  };

  const destroy = (): void => {
    positionController.destroy();
    overlayHandle.release();
    tip.remove();
    trigger.removeAttribute("aria-describedby");
  };

  return {
    el: tip,
    place: () => {
      void positionController.reposition();
    },
    setText,
    destroy,
  };
}
