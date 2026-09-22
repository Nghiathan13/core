import { FlaskConical, LayoutDashboard, Settings, createElement } from "lucide";
import type { IconNode } from "lucide";
import "./Sidebar.css";
import { t } from "../../i18n";
import { getCurrentPath } from "../../lib";
import { Button } from "../Button";
import { SettingsDialog } from "../SettingsDialog";

const LINKS: { path: string; key: string; icon: IconNode }[] = [
  { path: "/", key: "dashboard", icon: LayoutDashboard },
  { path: "/test", key: "test", icon: FlaskConical },
];

export function Sidebar(): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "sidebar";

  const items: { button: HTMLButtonElement; path: string }[] = [];

  for (const { path, key, icon } of LINKS) {
    const button = Button({
      icon: createElement(icon),
      label: t(key),
      i18nKey: key,
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

  const footer = document.createElement("div");
  footer.className = "sidebar-footer";
  footer.append(
    Button({
      icon: createElement(Settings),
      label: t("setting"),
      i18nKey: "setting",
      onClick: () => {
        document.body.append(SettingsDialog());
      },
    }),
  );
  nav.append(footer);

  return nav;
}
