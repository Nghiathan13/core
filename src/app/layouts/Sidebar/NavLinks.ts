import { FlaskConical, LayoutDashboard, createElement } from "lucide";
import type { IconNode } from "lucide";
import { t } from "@/shared/i18n";
import { getCurrentPath } from "@/shared/lib";
import type { View } from "@/shared/lib";
import { Button } from "@/shared/ui";

interface NavLink {
  path: string;
  key: string;
  icon: IconNode;
}

const LINKS: NavLink[] = [
  { path: "/", key: "dashboard", icon: LayoutDashboard },
  { path: "/test", key: "test", icon: FlaskConical },
];

export function NavLinks(): View {
  const controller = new AbortController();
  const content = document.createElement("div");
  content.className = "sidebar-content";

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
    content.append(button);
  }

  const syncPressed = (): void => {
    const current = getCurrentPath();
    for (const item of items) {
      item.button.setAttribute("aria-pressed", String(item.path === current));
    }
  };

  syncPressed();
  window.addEventListener("hashchange", syncPressed, { signal: controller.signal });

  return { el: content, destroy: () => controller.abort() };
}
