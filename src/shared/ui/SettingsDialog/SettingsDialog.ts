import { Palette, Settings, createElement } from "lucide";
import type { IconNode } from "lucide";
import { t } from "../../i18n";
import { Button } from "../Button";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { Modal } from "../Modal";
import { ThemeSwitcher } from "../ThemeSwitcher";
import "./SettingsDialog.css";

interface Section {
  id: string;
  key: string;
  icon: IconNode;
  render: () => HTMLElement;
}

const SECTIONS: Section[] = [
  { id: "general", key: "general", icon: Settings, render: () => LanguageSwitcher() },
  { id: "appearance", key: "appearance", icon: Palette, render: () => ThemeSwitcher() },
];

export function SettingsDialog(options?: { onClose?: () => void }): HTMLElement {
  const layout = document.createElement("div");
  layout.className = "settings-dialog";

  const nav = document.createElement("nav");
  nav.className = "settings-dialog-nav";

  const content = document.createElement("div");
  content.className = "settings-dialog-content";

  const items: { button: HTMLButtonElement; id: string }[] = [];

  const showSection = (id: string): void => {
    const section = SECTIONS.find((entry) => entry.id === id);
    if (section) {
      content.replaceChildren(section.render());
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

  return Modal({ titleKey: "setting", body: layout, onClose: options?.onClose });
}
