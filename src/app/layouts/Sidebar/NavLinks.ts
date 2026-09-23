import { FlaskConical, LayoutDashboard, createElement } from "lucide";
import type { IconNode } from "lucide";
import { t } from "@/shared/i18n";
import { getCurrentPath } from "@/shared/lib";
import type { View } from "@/shared/lib";
import { attachTooltip } from "@/shared/ui";
import { isCollapsed } from "./collapse";
import { NavLink } from "./NavLink";

interface NavItem {
  path: string;
  key: string;
  icon: IconNode;
}

const LINKS: NavItem[] = [
  { path: "/", key: "dashboard", icon: LayoutDashboard },
  { path: "/test", key: "test", icon: FlaskConical },
];

export function NavLinks(): View {
  const controller = new AbortController();
  const content = document.createElement("div");
  content.className = "sidebar-content";

  const items: { link: HTMLAnchorElement; path: string }[] = [];
  const detachTooltips: (() => void)[] = [];

  for (const { path, key, icon } of LINKS) {
    const link = NavLink({
      path,
      i18nKey: key,
      icon: createElement(icon),
      current: path === getCurrentPath(),
    });
    const { detach } = attachTooltip(link, {
      text: () => (isCollapsed() ? t(key) : ""),
      placement: "right",
    });
    detachTooltips.push(detach);
    items.push({ link, path });
    content.append(link);
  }

  const syncCurrent = (): void => {
    const current = getCurrentPath();
    for (const item of items) {
      if (item.path === current) {
        item.link.setAttribute("aria-current", "page");
      } else {
        item.link.removeAttribute("aria-current");
      }
    }
  };

  syncCurrent();
  window.addEventListener("hashchange", syncCurrent, { signal: controller.signal });

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
