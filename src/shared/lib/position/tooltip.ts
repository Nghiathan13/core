import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  arrow,
} from "@floating-ui/dom";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipPositionOptions {
  gap?: number;
  padding?: number;
}

export interface TooltipPositionResult {
  x: number;
  y: number;
  placement: TooltipPlacement;
  arrowX?: number;
  arrowY?: number;
}

export interface TooltipPositionController {
  reposition: () => Promise<TooltipPositionResult>;
  destroy: () => void;
}

export const TOOLTIP_MARGIN = 8;
export const TOOLTIP_GAP = 8;
export const TOOLTIP_ARROW_SIZE = 8;

/**
 * Computes and applies floating position for a tooltip and its arrow relative to trigger
 * using Floating UI collision detection and alignment.
 */
export async function computeTooltipPosition(
  trigger: HTMLElement,
  tip: HTMLElement,
  arrowEl: HTMLElement,
  placement: TooltipPlacement,
  options?: TooltipPositionOptions,
): Promise<TooltipPositionResult> {
  const gap = options?.gap ?? TOOLTIP_GAP;
  const padding = options?.padding ?? TOOLTIP_MARGIN;

  const {
    x,
    y,
    placement: finalPlacement,
    middlewareData,
  } = await computePosition(trigger, tip, {
    placement,
    middleware: [
      offset(gap),
      flip({ fallbackPlacements: ["top", "bottom", "left", "right"] }),
      shift({ padding }),
      arrow({ element: arrowEl, padding: 4 }),
    ],
  });

  const roundedX = Math.round(x);
  const roundedY = Math.round(y);
  tip.style.left = `${roundedX}px`;
  tip.style.top = `${roundedY}px`;
  tip.dataset.placement = finalPlacement;

  const arrowData = middlewareData.arrow;
  const arrowX = arrowData?.x != null ? Math.round(arrowData.x) : undefined;
  const arrowY = arrowData?.y != null ? Math.round(arrowData.y) : undefined;

  if (finalPlacement === "top" || finalPlacement === "bottom") {
    arrowEl.style.left = `${arrowX}px`;
    arrowEl.style.top = "";
  } else {
    arrowEl.style.top = `${arrowY}px`;
    arrowEl.style.left = "";
  }

  return {
    x: roundedX,
    y: roundedY,
    placement: finalPlacement as TooltipPlacement,
    arrowX,
    arrowY,
  };
}

/**
 * Binds autoUpdate lifecycle to reposition tooltip and its arrow on scroll, resize,
 * and element layout shifts.
 */
export function setupTooltipPosition(
  trigger: HTMLElement,
  tip: HTMLElement,
  arrowEl: HTMLElement,
  getPlacement: () => TooltipPlacement,
  options?: TooltipPositionOptions,
): TooltipPositionController {
  const initialPlacement = getPlacement();
  tip.dataset.placement = initialPlacement;

  // Immediate synchronous fallback so arrow is never rendered without positioning
  const half = TOOLTIP_ARROW_SIZE / 2;
  if (initialPlacement === "top" || initialPlacement === "bottom") {
    arrowEl.style.left = `calc(50% - ${half}px)`;
    arrowEl.style.top = "";
  } else {
    arrowEl.style.top = `calc(50% - ${half}px)`;
    arrowEl.style.left = "";
  }

  const reposition = (): Promise<TooltipPositionResult> =>
    computeTooltipPosition(trigger, tip, arrowEl, getPlacement(), options);

  const cleanup = autoUpdate(trigger, tip, () => {
    void reposition();
  });

  return {
    reposition,
    destroy: cleanup,
  };
}
