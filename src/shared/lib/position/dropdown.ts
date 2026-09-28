import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  size,
  type Placement,
} from "@floating-ui/dom";

export interface DropdownPositionOptions {
  placement?: Placement;
  gap?: number;
  padding?: number;
}

export interface DropdownPositionResult {
  x: number;
  y: number;
  placement: Placement;
}

export interface DropdownPositionController {
  reposition: () => Promise<DropdownPositionResult>;
  destroy: () => void;
}

export const MENU_GAP = 4;
export const VIEWPORT_MARGIN = 8;
export const DEFAULT_MENU_WIDTH = 160;

/**
 * Computes and applies floating position for a dropdown menu relative to its trigger
 * using Floating UI collision detection and alignment.
 */
export async function computeDropdownPosition(
  trigger: HTMLElement,
  menu: HTMLElement,
  options?: DropdownPositionOptions,
): Promise<DropdownPositionResult> {
  const gap = options?.gap ?? MENU_GAP;
  const padding = options?.padding ?? VIEWPORT_MARGIN;
  const placement = options?.placement ?? "bottom-start";

  const {
    x,
    y,
    placement: finalPlacement,
  } = await computePosition(trigger, menu, {
    placement,
    middleware: [
      offset(gap),
      flip({ fallbackPlacements: ["top-start", "bottom-end", "top-end"] }),
      shift({ padding }),
      size({
        apply({ rects, elements }) {
          elements.floating.style.minWidth = `${rects.reference.width || DEFAULT_MENU_WIDTH}px`;
        },
      }),
    ],
  });

  const roundedX = Math.round(x);
  const roundedY = Math.round(y);
  menu.style.left = `${roundedX}px`;
  menu.style.top = `${roundedY}px`;

  return {
    x: roundedX,
    y: roundedY,
    placement: finalPlacement,
  };
}

/**
 * Binds autoUpdate lifecycle to reposition dropdown menu on scroll, resize,
 * and element layout shifts.
 */
export function setupDropdownPosition(
  trigger: HTMLElement,
  menu: HTMLElement,
  options?: DropdownPositionOptions,
): DropdownPositionController {
  const triggerWidth = trigger.getBoundingClientRect().width;
  menu.style.minWidth = `${triggerWidth || DEFAULT_MENU_WIDTH}px`;

  const reposition = (): Promise<DropdownPositionResult> =>
    computeDropdownPosition(trigger, menu, options);

  const cleanup = autoUpdate(trigger, menu, () => {
    void reposition();
  });

  return {
    reposition,
    destroy: cleanup,
  };
}
