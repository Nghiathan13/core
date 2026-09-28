import { Check, createElement } from "lucide";
import { t } from "../../i18n";
import {
  computeDropdownPosition,
  getNextActiveIndex,
  isNavigationKey,
  isSelectKey,
} from "../../lib";
import type { DropdownOption } from "./types";

export interface DropdownMenuParams<T extends string> {
  label: string;
  options: DropdownOption<T>[];
  current: T;
  trigger: HTMLElement;
  wrapper: HTMLElement;
  onSelect: (value: T) => void;
  onClose: (returnFocus: boolean) => void;
}

export interface DropdownMenuInstance<T extends string> {
  el: HTMLElement;
  syncSelected: (value: T) => void;
  reposition: () => void;
  destroy: () => void;
}

export function DropdownMenu<T extends string>({
  label,
  options,
  current,
  trigger,
  wrapper,
  onSelect,
  onClose,
}: DropdownMenuParams<T>): DropdownMenuInstance<T> {
  let activeIndex = -1;

  const menu = document.createElement("div");
  menu.className = "dropdown-menu";
  menu.setAttribute("role", "listbox");
  menu.setAttribute("aria-label", label);

  const optionButtons = options.map((option) => {
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

    item.addEventListener("click", () => onSelect(option.value));
    return item;
  });

  for (const item of optionButtons) {
    menu.append(item);
  }

  document.body.append(menu);

  const place = (): void => {
    const rect = trigger.getBoundingClientRect();
    const size = menu.getBoundingClientRect();
    const pos = computeDropdownPosition(rect, size, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    menu.style.left = `${pos.x}px`;
    menu.style.top = `${pos.y}px`;
    menu.style.minWidth = `${pos.minWidth}px`;
  };

  place();

  const focusOption = (index: number): void => {
    activeIndex = index;
    optionButtons.forEach((button, position) => {
      button.tabIndex = position === index ? 0 : -1;
    });
    optionButtons[index]?.focus();
  };

  const selectedIndex = Math.max(
    0,
    options.findIndex((item) => item.value === current),
  );
  focusOption(selectedIndex);

  const onPointerDown = (event: PointerEvent): void => {
    const target = event.target instanceof Node ? event.target : null;
    if (!target) {
      return;
    }
    if (wrapper.contains(target) || menu.contains(target)) {
      return;
    }
    onClose(false);
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      // Consume Escape so layers below (e.g. Modal) don't dismiss
      // in the same keypress. One gesture dismisses one layer.
      event.stopPropagation();
      onClose(true);
      return;
    }
    if (event.key === "Tab") {
      onClose(false);
      return;
    }
    if (isNavigationKey(event.key)) {
      event.preventDefault();
      const next = getNextActiveIndex(
        activeIndex,
        optionButtons.length,
        event.key,
      );
      focusOption(next);
      return;
    }
    if (isSelectKey(event.key)) {
      const focused =
        document.activeElement instanceof HTMLButtonElement
          ? document.activeElement
          : null;
      const targetValue = focused?.dataset.value;
      const matched = options.find((opt) => opt.value === targetValue);
      if (matched && menu.contains(focused)) {
        event.preventDefault();
        onSelect(matched.value);
      }
    }
  };

  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("scroll", place, true);
  window.addEventListener("resize", place);

  const destroy = (): void => {
    document.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("scroll", place, true);
    window.removeEventListener("resize", place);
    menu.remove();
  };

  return {
    el: menu,
    syncSelected: (value: T) => {
      optionButtons.forEach((button) => {
        button.setAttribute(
          "aria-selected",
          String(button.dataset.value === value),
        );
      });
    },
    reposition: place,
    destroy,
  };
}
