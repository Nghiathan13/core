import { Settings, createElement } from "lucide";
import { t } from "@/shared/i18n";
import type { View } from "@/shared/lib";
import { Button, attachTooltip } from "@/shared/ui";
import { isCollapsed } from "./collapse";
import { SettingsModal } from "./SettingsModal";

export function SettingsButton(): View {
  let openModal: HTMLElement | null = null;

  const button = Button({
    icon: createElement(Settings),
    label: t("setting"),
    i18nKey: "setting",
    hasPopup: "dialog",
    expanded: false,
    onClick: () => {
      if (openModal?.isConnected) {
        return;
      }
      openModal = SettingsModal({
        onClose: () => {
          openModal = null;
          button.setAttribute("aria-expanded", "false");
        },
      });
      document.body.append(openModal);
      button.setAttribute("aria-expanded", "true");
    },
  });
  const { detach } = attachTooltip(button, {
    text: () => (isCollapsed() ? t("setting") : ""),
    placement: "right",
  });

  return {
    el: button,
    destroy: () => {
      detach();
      openModal?.remove();
      openModal = null;
    },
  };
}
