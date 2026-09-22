import "./TabButton.css";

interface TabButtonOptions {
  icon?: Element;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function TabButton({
  icon,
  label,
  selected,
  onClick,
}: TabButtonOptions): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "tab-button state-layer";
  button.setAttribute("aria-label", label);
  button.setAttribute("aria-pressed", String(selected));
  button.addEventListener("click", onClick);
  if (icon) {
    button.append(icon);
  } else {
    button.append(label);
  }
  return button;
}
