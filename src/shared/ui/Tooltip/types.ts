import type { TooltipPlacement } from "../../lib";

export type { TooltipPlacement };

export interface TooltipOptions {
  text: string | (() => string);
  placement?: TooltipPlacement | (() => TooltipPlacement);
  delay?: number;
}

export interface TooltipHandle {
  detach: () => void;
  refresh: () => void;
  show: () => void;
}

export interface TooltipSession {
  place: () => void;
  hide: () => void;
}
