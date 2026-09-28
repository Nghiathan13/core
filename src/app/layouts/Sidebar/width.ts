export const DEFAULT_WIDTH = 253;
export const MIN_WIDTH = 200;
export const COLLAPSED_WIDTH = 53;

const SNAP_WIDTH = 100;
const MAX_RATIO = 0.4;

export function maxWidth(viewportWidth: number): number {
  return viewportWidth * MAX_RATIO;
}

export function clampWidth(value: number, viewportWidth: number): number {
  return Math.min(Math.max(value, MIN_WIDTH), maxWidth(viewportWidth));
}

export function computeLiveWidth(
  clientX: number,
  rectLeft: number,
  viewportWidth: number,
): number {
  return Math.min(
    Math.max(clientX - rectLeft, COLLAPSED_WIDTH),
    maxWidth(viewportWidth),
  );
}

export function shouldSnapCollapse(liveWidth: number): boolean {
  return liveWidth < SNAP_WIDTH;
}

export function applySidebarWidthTokens(
  root: HTMLElement = document.documentElement,
): void {
  root.style.setProperty("--sidebar-width", `${DEFAULT_WIDTH}px`);
  root.style.setProperty("--sidebar-collapsed-width", `${COLLAPSED_WIDTH}px`);
}
