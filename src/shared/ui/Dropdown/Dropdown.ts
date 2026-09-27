import { Check, ChevronDown, createElement } from "lucide";
import { t } from "../../i18n";
import type { View } from "../../lib";
import { Button } from "../Button";
import "./Dropdown.css";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
  i18nKey?: string;
}

interface DropdownParams<T extends string> {
  label: string;
  options: DropdownOption<T>[];
  value: T;
  onSelect: (value: T) => void;
}

export interface DropdownView<T extends string> extends View {
  getValue: () => T;
  setValue: (value: T) => void;
}

const MENU_GAP = 4;
const VIEWPORT_MARGIN = 8;

function resolveDisplay<T extends string>(option: DropdownOption<T> | undefined): { text: string; i18nKey?: string } {
  if (!option) {
    return { text: "" };
  }
  if (option.i18nKey) {
    return { text: t(option.i18nKey), i18nKey: option.i18nKey };
  }
  return { text: option.label };
}

export function Dropdown<T extends string>({ label, options, value, onSelect }: DropdownParams<T>): DropdownView<T> {
  const controller = new AbortController();
  const signal = controller.signal;

  let current = value;
  let menu: HTMLElement | null = null;
  let optionButtons: HTMLButtonElement[] = [];
  let activeIndex = -1;
  let closeListeners: (() => void)[] = [];

  const wrapper = document.createElement("div");
  wrapper.className = "dropdown";

  const initial = options.find((item) => item.value === current);
  const initialDisplay = resolveDisplay(initial);

  const trigger = Button({
    label: initialDisplay.text,
    i18nKey: initialDisplay.i18nKey,
    expanded: false,
    hasPopup: "listbox",
    onClick: () => {
      if (menu) {
        close(false);
      } else {
        open();
      }
    },
  });
  trigger.classList.add("dropdown-trigger");
  trigger.setAttribute("aria-label", label);
  const chevron = createElement(ChevronDown);
  chevron.classList.add("dropdown-chevron");
  chevron.setAttribute("aria-hidden", "true");
  trigger.append(chevron);
  wrapper.append(trigger);

  const syncTrigger = (): void => {
    const option = options.find((item) => item.value === current);
    const display = resolveDisplay(option);
    const textSpan = trigger.querySelector("[data-i18n]");
    if (display.i18nKey) {
      if (textSpan) {
        textSpan.textContent = display.text;
        textSpan.setAttribute("data-i18n", display.i18nKey);
      } else {
        const span = document.createElement("span");
        span.textContent = display.text;
        span.setAttribute("data-i18n", display.i18nKey);
        trigger.insertBefore(span, chevron);
      }
    } else if (textSpan) {
      textSpan.remove();
      trigger.insertBefore(document.createTextNode(display.text), chevron);
    } else {
      const first = trigger.firstChild;
      if (first) {
        first.textContent = display.text;
      }
    }
    trigger.setAttribute("aria-label", label);
  };

  const place = (): void => {
    if (!menu) {
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const size = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const width = size.width || rect.width || 160;
    const height = size.height || 0;
    const x = Math.min(Math.max(rect.x, VIEWPORT_MARGIN), Math.max(VIEWPORT_MARGIN, viewportWidth - width - VIEWPORT_MARGIN));
    const below = rect.y + rect.height + MENU_GAP;
    const above = rect.y - height - MENU_GAP;
    const fitsBelow = below + height <= viewportHeight - VIEWPORT_MARGIN;
    const y = fitsBelow ? below : Math.max(VIEWPORT_MARGIN, above);
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.minWidth = `${rect.width || 160}px`;
  };

  const focusOption = (index: number): void => {
    activeIndex = index;
    optionButtons.forEach((button, position) => {
      button.tabIndex = position === index ? 0 : -1;
    });
    optionButtons[index]?.focus();
  };

  const select = (next: T): void => {
    if (next === current) {
      close(true);
      return;
    }
    current = next;
    syncTrigger();
    syncSelected();
    close(true);
    onSelect(next);
  };

  const syncSelected = (): void => {
    optionButtons.forEach((button) => {
      button.setAttribute("aria-selected", String(button.dataset.value === current));
    });
  };

  const detachCloseListeners = (): void => {
    for (const cleanup of closeListeners) {
      cleanup();
    }
    closeListeners = [];
  };

  function close(returnFocus: boolean): void {
    if (!menu) {
      return;
    }
    detachCloseListeners();
    menu.remove();
    menu = null;
    optionButtons = [];
    activeIndex = -1;
    trigger.setAttribute("aria-expanded", "false");
    if (returnFocus) {
      trigger.focus();
    }
  }

  function open(): void {
    if (menu) {
      return;
    }
    menu = document.createElement("div");
    menu.className = "dropdown-menu";
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-label", label);

    optionButtons = options.map((option) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "dropdown-option state-layer";
      item.setAttribute("role", "option");
      item.dataset.value = option.value;
      item.setAttribute("aria-selected", String(option.value === current));
      item.tabIndex = -1;
      if (option.i18nKey) {
        const text = document.createElement("span");
        text.textContent = t(option.i18nKey);
        text.setAttribute("data-i18n", option.i18nKey);
        item.append(text);
      } else {
        item.append(option.label);
      }
      const tick = createElement(Check);
      tick.classList.add("dropdown-tick");
      tick.setAttribute("aria-hidden", "true");
      item.append(tick);
      item.addEventListener("click", () => select(option.value));
      return item;
    });

    for (const item of optionButtons) {
      menu.append(item);
    }
    document.body.append(menu);
    trigger.setAttribute("aria-expanded", "true");
    place();

    const selectedIndex = Math.max(
      0,
      options.findIndex((item) => item.value === current),
    );

    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target instanceof Node ? event.target : null;
      if (!target) {
        return;
      }
      if (wrapper.contains(target) || menu?.contains(target)) {
        return;
      }
      close(false);
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!menu) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        // Consume Escape so layers below (e.g. Modal) don't dismiss
        // in the same keypress. One gesture dismisses one layer.
        event.stopPropagation();
        close(true);
        return;
      }
      if (event.key === "Tab") {
        close(false);
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const delta = event.key === "ArrowDown" ? 1 : -1;
        const next = (activeIndex + delta + optionButtons.length) % optionButtons.length;
        focusOption(next);
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        focusOption(0);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        focusOption(optionButtons.length - 1);
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        const focused = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
        const next = focused?.dataset.value;
        if (next && menu.contains(focused)) {
          event.preventDefault();
          select(next as T);
        }
      }
    };
    const onReposition = (): void => place();

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    closeListeners = [
      () => document.removeEventListener("pointerdown", onPointerDown),
      () => document.removeEventListener("keydown", onKeyDown),
      () => window.removeEventListener("scroll", onReposition, true),
      () => window.removeEventListener("resize", onReposition),
    ];

    focusOption(selectedIndex);
  }

  const onTriggerKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      open();
    }
  };
  trigger.addEventListener("keydown", onTriggerKeyDown, { signal });

  return {
    el: wrapper,
    destroy: () => {
      controller.abort();
      detachCloseListeners();
      menu?.remove();
      menu = null;
    },
    getValue: () => current,
    setValue: (next: T) => {
      current = next;
      syncTrigger();
      syncSelected();
    },
  };
}
