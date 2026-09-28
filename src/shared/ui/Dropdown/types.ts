import type { View } from "../../lib";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
  i18nKey?: string;
}

export interface DropdownParams<T extends string> {
  label: string;
  options: DropdownOption<T>[];
  value: T;
  onSelect: (value: T) => void;
}

export interface DropdownView<T extends string> extends View {
  getValue: () => T;
  setValue: (value: T) => void;
}
