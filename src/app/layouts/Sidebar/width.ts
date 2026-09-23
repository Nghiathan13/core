export const DEFAULT_WIDTH = 253;
export const MIN_WIDTH = 153;
export const MAX_RATIO = 0.4;
export const COLLAPSED_WIDTH = 53;
export const SNAP_WIDTH = 76;

export function maxWidth(viewportWidth: number): number {
  return viewportWidth * MAX_RATIO;
}

export function clampWidth(value: number, viewportWidth: number): number {
  return Math.min(Math.max(value, MIN_WIDTH), maxWidth(viewportWidth));
}

export function computeLiveWidth(clientX: number, rectLeft: number, viewportWidth: number): number {
  return Math.min(Math.max(clientX - rectLeft, COLLAPSED_WIDTH), maxWidth(viewportWidth));
}

export function shouldSnapCollapse(liveWidth: number): boolean {
  return liveWidth < SNAP_WIDTH;
}
