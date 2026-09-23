import { FlaskConical, LayoutDashboard, createElement } from "lucide";
import type { IconNode } from "lucide";
import { t } from "@/shared/i18n";
import { getCurrentPath } from "@/shared/lib";
import type { View } from "@/shared/lib";
import { Button, attachTooltip } from "@/shared/ui";
import { isCollapsed } from "./collapse";

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
  const detachTooltips: (() => void)[] = [];

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
    const { detach } = attachTooltip(button, {
      text: () => (isCollapsed() ? t(key) : ""),
      placement: "right",
    });
    detachTooltips.push(detach);
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

  return {
    el: content,
    destroy: () => {
      controller.abort();
      for (const detach of detachTooltips) {
        detach();
      }
    },
  };
}
