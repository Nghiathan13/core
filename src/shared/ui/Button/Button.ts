import "./Button.css";

interface ButtonOptions {
  icon?: Element;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function Button({ icon, label, selected, onClick }: ButtonOptions): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button state-layer";
  button.setAttribute("aria-pressed", String(selected));
  button.addEventListener("click", onClick);
  if (icon) {
    button.append(icon);
  }
  button.append(label);
  return button;
}
