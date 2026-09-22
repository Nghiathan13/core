import "./Button.css";

interface ButtonOptions {
  icon?: Element;
  label: string;
  hideLabel?: boolean;
  i18nKey?: string;
  selected?: boolean;
  onClick?: () => void;
}

export function Button({ icon, label, hideLabel, i18nKey, selected, onClick }: ButtonOptions): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button state-layer";
  button.setAttribute("aria-label", label);
  if (selected !== undefined) {
    button.setAttribute("aria-pressed", String(selected));
  }
  if (onClick) {
    button.addEventListener("click", onClick);
  }
  if (icon) {
    button.append(icon);
  }
  if (!hideLabel) {
    if (i18nKey) {
      const text = document.createElement("span");
      text.textContent = label;
      text.setAttribute("data-i18n", i18nKey);
      button.append(text);
    } else {
      button.append(label);
    }
  }
  return button;
}
