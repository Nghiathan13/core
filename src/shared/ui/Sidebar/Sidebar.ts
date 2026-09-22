import { FlaskConical, LayoutDashboard, createElement } from "lucide";
import type { IconNode } from "lucide";
import "./Sidebar.css";
import { getCurrentPath } from "../../lib";
import { Button } from "../Button";
import { ThemeSwitcher } from "../ThemeSwitcher";

const LINKS: { path: string; label: string; icon: IconNode }[] = [
  { path: "/", label: "dashboard", icon: LayoutDashboard },
  { path: "/test", label: "test", icon: FlaskConical },
];

export function Sidebar(): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "sidebar";

  const items: { button: HTMLButtonElement; path: string }[] = [];

  for (const { path, label, icon } of LINKS) {
    const button = Button({
      icon: createElement(icon),
      label,
      selected: path === getCurrentPath(),
      onClick: () => {
        window.location.hash = `#${path}`;
      },
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
