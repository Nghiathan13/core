import "./Tooltip.css";
import {
  activateSession,
  clearActiveSession,
  isWithinGracePeriod,
  recordHide,
  TOOLTIP_GRACE_PERIOD,
  TOOLTIP_SHOW_DELAY,
} from "./TooltipSession";
import { TooltipView } from "./TooltipView";
import type { TooltipViewInstance } from "./TooltipView";
import type {
  TooltipHandle,
  TooltipOptions,
  TooltipPlacement,
  TooltipSession,
} from "./types";

export { TOOLTIP_GRACE_PERIOD, TOOLTIP_SHOW_DELAY };
export type { TooltipHandle };

export function attachTooltip(
  trigger: HTMLElement,
  options: TooltipOptions,
): TooltipHandle {
  const delay = options.delay ?? TOOLTIP_SHOW_DELAY;
  let view: TooltipViewInstance | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pressed = false;

  const resolveText = (): string =>
    typeof options.text === "function" ? options.text() : options.text;

  const resolvePlacement = (): TooltipPlacement =>
    typeof options.placement === "function"
      ? options.placement()
      : (options.placement ?? "top");

  const session: TooltipSession = {
    place: () => view?.place(),
    hide: () => hide(),
  };

  const show = (): void => {
    if (view) {
      return;
    }
    const text = resolveText();
    if (text === "") {
      return;
    }
    activateSession(session);
    view = TooltipView({
      trigger,
      text,
      getPlacement: resolvePlacement,
    });
  };

  const hide = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
    if (view) {
      recordHide();
      view.destroy();
      view = null;
    }
    clearActiveSession(session);
  };

  const refresh = (): void => {
    if (!view) {
      return;
    }
    const text = resolveText();
    if (text === "") {
      hide();
      return;
    }
    view.setText(text);
  };

  const schedule = (): void => {
    if (view || timer !== undefined) {
      return;
    }
    if (isWithinGracePeriod()) {
      show();
      return;
    }
    timer = setTimeout(() => {
      timer = undefined;
      show();
    }, delay);
  };

  const onMouseDown = (): void => {
    pressed = true;
    hide();
  };

  const onMouseUp = (): void => {
    pressed = false;
  };

  const onFocus = (): void => {
    if (!pressed && trigger.matches(":focus-visible")) {
      show();
    }
  };

  const onBlur = (): void => {
    pressed = false;
    hide();
  };

  trigger.addEventListener("mouseenter", schedule);
  trigger.addEventListener("mouseleave", hide);
  trigger.addEventListener("focus", onFocus);
  trigger.addEventListener("blur", onBlur);
  trigger.addEventListener("mousedown", onMouseDown);
  trigger.addEventListener("mouseup", onMouseUp);
  trigger.addEventListener("click", hide);

  return {
    detach: () => {
      trigger.removeEventListener("mouseenter", schedule);
      trigger.removeEventListener("mouseleave", hide);
      trigger.removeEventListener("focus", onFocus);
      trigger.removeEventListener("blur", onBlur);
      trigger.removeEventListener("mousedown", onMouseDown);
      trigger.removeEventListener("mouseup", onMouseUp);
      trigger.removeEventListener("click", hide);
      hide();
    },
    refresh,
    show,
  };
}
