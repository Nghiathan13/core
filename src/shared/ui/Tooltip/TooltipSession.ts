import type { TooltipSession } from "./types";

export const TOOLTIP_SHOW_DELAY = 200;
export const TOOLTIP_GRACE_PERIOD = 400;

let lastHideAt = 0;
let active: TooltipSession | null = null;
let globalsBound = false;

function bindGlobals(): void {
  if (globalsBound) {
    return;
  }
  globalsBound = true;
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      active?.hide();
    }
  });
  window.addEventListener("scroll", () => active?.place(), true);
  window.addEventListener("resize", () => active?.place());
}

export function isWithinGracePeriod(): boolean {
  const elapsed = Date.now() - lastHideAt;
  return elapsed >= 0 && elapsed < TOOLTIP_GRACE_PERIOD;
}

export function recordHide(): void {
  lastHideAt = Date.now();
}

export function activateSession(session: TooltipSession): void {
  bindGlobals();
  if (active && active !== session) {
    active.hide();
  }
  active = session;
}

export function clearActiveSession(session: TooltipSession): void {
  if (active === session) {
    active = null;
  }
}
