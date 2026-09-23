import "./Sidebar.css";
import type { View } from "@/shared/lib";
import { CollapseButton } from "./CollapseButton";
import { NavLinks } from "./NavLinks";
import { ResizeHandle } from "./ResizeHandle";
import { SettingsButton } from "./SettingsButton";

export function Sidebar(): View {
  const nav = document.createElement("nav");
  nav.className = "sidebar";
  nav.id = "sidebar";

  const collapseButton = CollapseButton();
  const header = document.createElement("div");
  header.className = "sidebar-header";
  header.append(collapseButton.el);
  nav.append(header);

  const navLinks = NavLinks();
  nav.append(navLinks.el);

  const settingsButton = SettingsButton();
  const footer = document.createElement("div");
  footer.className = "sidebar-footer";
  footer.append(settingsButton.el);
  nav.append(footer);

  const resizeHandle = ResizeHandle(nav);

  const root = document.createElement("div");
  root.append(nav, resizeHandle.el);

  return {
    el: root,
    destroy: () => {
      navLinks.destroy?.();
      collapseButton.destroy?.();
      settingsButton.destroy?.();
      resizeHandle.destroy?.();
    },
  };
}
