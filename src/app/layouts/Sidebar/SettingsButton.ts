import { Settings, createElement } from "lucide";
import { t } from "@/shared/i18n";
import type { View } from "@/shared/lib";
import { Button, SettingsDialog, attachTooltip } from "@/shared/ui";
import { isCollapsed } from "./collapse";

export function SettingsButton(): View {
  let openDialog: HTMLElement | null = null;

  const button = Button({
    icon: createElement(Settings),
    label: t("setting"),
    i18nKey: "setting",
    hasPopup: "dialog",
    expanded: false,
    onClick: () => {
      if (openDialog?.isConnected) {
        return;
      }
      openDialog = SettingsDialog({
        onClose: () => {
          openDialog = null;
          button.setAttribute("aria-expanded", "false");
        },
      });
      document.body.append(openDialog);
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
      openDialog?.remove();
      openDialog = null;
    },
  };
}
