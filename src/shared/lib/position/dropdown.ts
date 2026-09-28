export interface DropdownRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DropdownSize {
  width: number;
  height: number;
}

export interface DropdownViewport {
  width: number;
  height: number;
}

export interface DropdownPosition {
  x: number;
  y: number;
  minWidth: number;
}

export const MENU_GAP = 4;
export const VIEWPORT_MARGIN = 8;
export const DEFAULT_MENU_WIDTH = 160;

/**
 * Computes the placement of a floating dropdown menu relative to the trigger button
 * while ensuring it stays within the visible viewport.
 */
export function computeDropdownPosition(
  triggerRect: DropdownRect,
  menuSize: DropdownSize,
  viewport: DropdownViewport,
  gap = MENU_GAP,
  margin = VIEWPORT_MARGIN,
  defaultWidth = DEFAULT_MENU_WIDTH,
): DropdownPosition {
  const width = menuSize.width || triggerRect.width || defaultWidth;
  const height = menuSize.height || 0;

  const minX = margin;
  const maxX = Math.max(margin, viewport.width - width - margin);
  const x = Math.min(Math.max(triggerRect.x, minX), maxX);

  const below = triggerRect.y + triggerRect.height + gap;
  const above = triggerRect.y - height - gap;
  const fitsBelow = below + height <= viewport.height - margin;
  const y = fitsBelow ? below : Math.max(margin, above);

  return {
    x,
    y,
    minWidth: triggerRect.width || defaultWidth,
  };
}
