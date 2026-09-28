import "./Dropdown.css";
import { DropdownMenu } from "./DropdownMenu";
import type { DropdownMenuInstance } from "./DropdownMenu";
import { DropdownTrigger } from "./DropdownTrigger";
import type { DropdownOption, DropdownParams, DropdownView } from "./types";

export type { DropdownOption, DropdownParams, DropdownView };

export function Dropdown<T extends string>({
  label,
  options,
  value,
  onSelect,
}: DropdownParams<T>): DropdownView<T> {
  const controller = new AbortController();
  const signal = controller.signal;

  let current = value;
  let menuInstance: DropdownMenuInstance<T> | null = null;

  const wrapper = document.createElement("div");
  wrapper.className = "dropdown";

  const close = (returnFocus: boolean): void => {
    if (!menuInstance) {
      return;
    }
    menuInstance.destroy();
    menuInstance = null;
    trigger.setExpanded(false);
    if (returnFocus) {
      trigger.focus();
    }
  };

  const open = (): void => {
    if (menuInstance) {
      return;
    }
    menuInstance = DropdownMenu<T>({
      label,
      options,
      current,
      trigger: trigger.el,
      wrapper,
      onSelect: (next: T) => {
        if (next === current) {
          close(true);
          return;
        }
        current = next;
        trigger.sync(options.find((item) => item.value === current));
        menuInstance?.syncSelected(current);
        close(true);
        onSelect(next);
      },
      onClose: close,
    });
    trigger.setExpanded(true);
  };

  const initial = options.find((item) => item.value === current);
  const trigger = DropdownTrigger<T>({
    label,
    initialOption: initial,
    onClick: () => {
      if (menuInstance) {
        close(false);
      } else {
        open();
      }
    },
    onOpenKeyDown: open,
    signal,
  });

  wrapper.append(trigger.el);

  return {
    el: wrapper,
    destroy: () => {
      controller.abort();
      close(false);
    },
    getValue: () => current,
    setValue: (next: T) => {
      current = next;
      trigger.sync(options.find((item) => item.value === current));
      menuInstance?.syncSelected(current);
    },
  };
}
