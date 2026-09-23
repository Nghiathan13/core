export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TooltipSize {
  width: number;
  height: number;
}

export interface TooltipViewport {
  width: number;
  height: number;
}

export interface PlacedTooltip {
  x: number;
  y: number;
  placement: TooltipPlacement;
}

export const TOOLTIP_MARGIN = 8;
export const TOOLTIP_GAP = 8;
export const TOOLTIP_ARROW_SIZE = 8;

const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const FALLBACK_ORDER: TooltipPlacement[] = ["top", "bottom", "left", "right"];

function candidate(rect: TooltipRect, size: TooltipSize, placement: TooltipPlacement): { x: number; y: number } {
  switch (placement) {
    case "top":
      return { x: rect.x + (rect.width - size.width) / 2, y: rect.y - size.height - TOOLTIP_GAP };
    case "bottom":
      return { x: rect.x + (rect.width - size.width) / 2, y: rect.y + rect.height + TOOLTIP_GAP };
    case "left":
      return { x: rect.x - size.width - TOOLTIP_GAP, y: rect.y + (rect.height - size.height) / 2 };
    case "right":
      return { x: rect.x + rect.width + TOOLTIP_GAP, y: rect.y + (rect.height - size.height) / 2 };
  }
}

function axisFits(x: number, y: number, size: TooltipSize, viewport: TooltipViewport, placement: TooltipPlacement): boolean {
  if (placement === "top" || placement === "bottom") {
    return y >= TOOLTIP_MARGIN && y + size.height <= viewport.height - TOOLTIP_MARGIN;
  }
  return x >= TOOLTIP_MARGIN && x + size.width <= viewport.width - TOOLTIP_MARGIN;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function shiftCrossAxis(
  x: number,
  y: number,
  size: TooltipSize,
  viewport: TooltipViewport,
  placement: TooltipPlacement,
): { x: number; y: number } {
  if (placement === "top" || placement === "bottom") {
    return { x: clamp(x, TOOLTIP_MARGIN, viewport.width - size.width - TOOLTIP_MARGIN), y };
  }
  return { x, y: clamp(y, TOOLTIP_MARGIN, viewport.height - size.height - TOOLTIP_MARGIN) };
}

export function computeArrowOffset(triggerCenter: number, tipStart: number, tipSize: number): number {
  const half = TOOLTIP_ARROW_SIZE / 2;
  return clamp(triggerCenter - tipStart, half + 2, tipSize - half - 2);
}

export function computePlacement(
  rect: TooltipRect,
  size: TooltipSize,
  viewport: TooltipViewport,
  preferred: TooltipPlacement,
): PlacedTooltip {
  const order = [preferred, OPPOSITE[preferred], ...FALLBACK_ORDER.filter((item) => item !== preferred && item !== OPPOSITE[preferred])];
  for (const placement of order) {
    const { x, y } = candidate(rect, size, placement);
    if (axisFits(x, y, size, viewport, placement)) {
      const shifted = shiftCrossAxis(x, y, size, viewport, placement);
      return { x: shifted.x, y: shifted.y, placement };
    }
  }
  const { x, y } = candidate(rect, size, preferred);
  return {
    x: clamp(x, TOOLTIP_MARGIN, viewport.width - size.width - TOOLTIP_MARGIN),
    y: clamp(y, TOOLTIP_MARGIN, viewport.height - size.height - TOOLTIP_MARGIN),
    placement: preferred,
  };
}
