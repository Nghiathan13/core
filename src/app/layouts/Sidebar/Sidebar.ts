import { FlaskConical, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Settings, createElement } from "lucide";
import type { IconNode } from "lucide";
import "./Sidebar.css";
import { t } from "@/shared/i18n";
import { getCurrentPath } from "@/shared/lib";
import { Button, SettingsDialog } from "@/shared/ui";

const LINKS: { path: string; key: string; icon: IconNode }[] = [
  { path: "/", key: "dashboard", icon: LayoutDashboard },
  { path: "/test", key: "test", icon: FlaskConical },
];

const DEFAULT_WIDTH = 253;
const MIN_WIDTH = 153;
const MAX_RATIO = 0.4;
const DRAG_THRESHOLD = 4;
const COLLAPSED_WIDTH = 53;
const SNAP_WIDTH = 76;

const maxWidth = (): number => window.innerWidth * MAX_RATIO;
const clampWidth = (value: number): number => Math.min(Math.max(value, MIN_WIDTH), maxWidth());

export function Sidebar(): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "sidebar";

  let collapsed = false;
  let customWidth = DEFAULT_WIDTH;

  const applyCustomWidth = (): void => {
    document.body.style.setProperty("--sidebar-width", `${clampWidth(customWidth)}px`);
  };

  const syncToggleUI = (): void => {
    toggleButton.querySelector("svg")?.replaceWith(createElement(collapsed ? PanelLeftOpen : PanelLeftClose));
    toggleButton.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
  };

  const setCollapsed = (value: boolean): void => {
    collapsed = value;
    if (collapsed) {
      document.body.setAttribute("data-sidebar", "collapsed");
      document.body.style.removeProperty("--sidebar-width");
    } else {
      document.body.removeAttribute("data-sidebar");
      applyCustomWidth();
    }
    syncToggleUI();
  };

  const toggleButton = Button({
    icon: createElement(PanelLeftClose),
    label: "Collapse sidebar",
    hideLabel: true,
    onClick: () => setCollapsed(!collapsed),
  });
  const header = document.createElement("div");
  header.className = "sidebar-header";
  header.append(toggleButton);
  nav.append(header);

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
  nav.append(content);

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

  const handle = document.createElement("div");
  handle.className = "sidebar-resize-handle";

  handle.addEventListener("pointerdown", (event) => {
    const wasCollapsed = collapsed;
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);

    const startX = event.clientX;

    const move = (moveEvent: PointerEvent): void => {
      if (Math.abs(moveEvent.clientX - startX) < DRAG_THRESHOLD) {
        return;
      }
      document.body.classList.add("resizing");
      const rect = nav.getBoundingClientRect();
      const live = Math.min(Math.max(moveEvent.clientX - rect.left, COLLAPSED_WIDTH), maxWidth());
      if (live < SNAP_WIDTH) {
        if (!collapsed) {
          setCollapsed(true);
        }
      } else {
        customWidth = clampWidth(live);
        if (collapsed) {
          setCollapsed(false);
        } else {
          applyCustomWidth();
        }
      }
    };
    const cleanup = (): void => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", cleanup);
      document.body.classList.remove("resizing");
    };
    const up = (upEvent: PointerEvent): void => {
      cleanup();
      if (wasCollapsed && Math.abs(upEvent.clientX - startX) < DRAG_THRESHOLD) {
        setCollapsed(false);
      }
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", cleanup);
  });

  handle.addEventListener("dblclick", () => {
    customWidth = DEFAULT_WIDTH;
    if (!collapsed) {
      applyCustomWidth();
    }
  });

  window.addEventListener("resize", () => {
    if (!collapsed) {
      customWidth = clampWidth(customWidth);
      applyCustomWidth();
    }
  });

  const root = document.createElement("div");
  root.append(nav, handle);

  return root;
}
