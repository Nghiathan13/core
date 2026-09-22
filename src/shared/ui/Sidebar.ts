import "./Sidebar.css";
import { ThemeSwitcher } from "./ThemeSwitcher";

const LINKS = [
  { path: "/", label: "dashboard" },
  { path: "/test", label: "test" },
];

export function Sidebar(): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "sidebar";

  for (const { path, label } of LINKS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sidebar__button state-layer";
    button.textContent = label;
    button.addEventListener("click", () => {
      window.location.hash = `#${path}`;
    });
    nav.append(button);
  }

  nav.append(ThemeSwitcher());

  return nav;
}
