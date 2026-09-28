import { ChevronDown, createElement } from "lucide";
import { t } from "../../i18n";
import { isTriggerOpenKey } from "../../lib";
import { Button } from "../Button";
import type { DropdownOption } from "./types";

export interface DropdownTriggerParams<T extends string> {
  label: string;
  initialOption: DropdownOption<T> | undefined;
  onClick: () => void;
  onOpenKeyDown: () => void;
  signal?: AbortSignal;
}

export interface DropdownTriggerInstance<T extends string> {
  el: HTMLButtonElement;
  sync: (option: DropdownOption<T> | undefined) => void;
  setExpanded: (expanded: boolean) => void;
  focus: () => void;
}

export function resolveDisplay<T extends string>(
  option: DropdownOption<T> | undefined,
): { text: string; i18nKey?: string } {
  if (!option) {
    return { text: "" };
  }
  if (option.i18nKey) {
    return { text: t(option.i18nKey), i18nKey: option.i18nKey };
  }
  return { text: option.label };
}

export function DropdownTrigger<T extends string>({
  label,
  initialOption,
  onClick,
  onOpenKeyDown,
  signal,
}: DropdownTriggerParams<T>): DropdownTriggerInstance<T> {
  const initialDisplay = resolveDisplay(initialOption);

  const el = Button({
    label: initialDisplay.text,
    i18nKey: initialDisplay.i18nKey,
    expanded: false,
    hasPopup: "listbox",
    onClick,
  });

  el.classList.add("dropdown-trigger");
  el.setAttribute("aria-label", label);

  const chevron = createElement(ChevronDown);
  chevron.classList.add("dropdown-chevron");
  chevron.setAttribute("aria-hidden", "true");
  el.append(chevron);

  const sync = (option: DropdownOption<T> | undefined): void => {
    const display = resolveDisplay(option);
    const textSpan = el.querySelector("[data-i18n]");

    if (display.i18nKey) {
      if (textSpan) {
        textSpan.textContent = display.text;
        textSpan.setAttribute("data-i18n", display.i18nKey);
      } else {
        const span = document.createElement("span");
        span.textContent = display.text;
        span.setAttribute("data-i18n", display.i18nKey);
        el.insertBefore(span, chevron);
      }
    } else if (textSpan) {
      textSpan.remove();
      el.insertBefore(document.createTextNode(display.text), chevron);
    } else {
      const first = el.firstChild;
      if (first) {
        first.textContent = display.text;
      }
    }

    el.setAttribute("aria-label", label);
  };

  el.addEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (isTriggerOpenKey(event.key)) {
        event.preventDefault();
        onOpenKeyDown();
      }
    },
    { signal },
  );

  return {
    el,
    sync,
    setExpanded: (expanded: boolean) => {
      el.setAttribute("aria-expanded", String(expanded));
    },
    focus: () => el.focus(),
  };
}
