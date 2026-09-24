import { Palette, Settings, createElement } from "lucide";
import type { IconNode } from "lucide";
import { t } from "@/shared/i18n";
import type { View } from "@/shared/lib";
import { Button, LanguageSwitcher, Modal, ThemeSwitcher } from "@/shared/ui";
import "./SettingsModal.css";

interface Section {
  id: string;
  key: string;
  icon: IconNode;
  render: () => View;
}

const SECTIONS: Section[] = [
  { id: "general", key: "general", icon: Settings, render: () => LanguageSwitcher() },
  { id: "appearance", key: "appearance", icon: Palette, render: () => ThemeSwitcher() },
];

export function SettingsModal(options?: { onClose?: () => void }): HTMLElement {
  const layout = document.createElement("div");
  layout.className = "settings-modal";

  const nav = document.createElement("nav");
  nav.className = "settings-modal-nav";

  const content = document.createElement("div");
  content.className = "settings-modal-content";

  const items: { button: HTMLButtonElement; id: string }[] = [];
  let contentDestroy: (() => void) | undefined;

  const showSection = (id: string): void => {
    contentDestroy?.();
    contentDestroy = undefined;
    const section = SECTIONS.find((entry) => entry.id === id);
    if (section) {
      const view = section.render();
      content.replaceChildren(view.el);
      contentDestroy = view.destroy;
    }
    for (const item of items) {
      item.button.setAttribute("aria-pressed", String(item.id === id));
    }
  };

  for (const section of SECTIONS) {
    const button = Button({
      icon: createElement(section.icon),
      label: t(section.key),
      i18nKey: section.key,
      selected: section.id === SECTIONS[0].id,
      onClick: () => showSection(section.id),
    });
    items.push({ button, id: section.id });
    nav.append(button);
  }

  layout.append(nav, content);
  showSection(SECTIONS[0].id);

  return Modal({
    titleKey: "setting",
    body: layout,
    onClose: () => {
      contentDestroy?.();
      options?.onClose?.();
    },
  });
}
