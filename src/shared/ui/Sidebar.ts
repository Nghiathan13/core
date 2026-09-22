import "./Sidebar.css";
import { getCurrentPath } from "../lib";
import { ThemeSwitcher } from "./ThemeSwitcher";

const LINKS = [
  { path: "/", label: "dashboard" },
  { path: "/test", label: "test" },
];

export function Sidebar(): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "sidebar";

  const items: { button: HTMLButtonElement; path: string }[] = [];

  for (const { path, label } of LINKS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sidebar__button state-layer";
    button.textContent = label;
    button.addEventListener("click", () => {
      window.location.hash = `#${path}`;
    });
    items.push({ button, path });
    nav.append(button);
  }

  const syncPressed = (): void => {
    const current = getCurrentPath();
    for (const item of items) {
      item.button.setAttribute("aria-pressed", String(item.path === current));
    }
  };

  syncPressed();
  window.addEventListener("hashchange", syncPressed);

  nav.append(ThemeSwitcher());

  return nav;
}
