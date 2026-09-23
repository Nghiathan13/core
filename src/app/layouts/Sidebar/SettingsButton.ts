import { Settings, createElement } from "lucide";
import { t } from "@/shared/i18n";
import type { View } from "@/shared/lib";
import { Button, SettingsDialog } from "@/shared/ui";

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

  return {
    el: button,
    destroy: () => {
      openDialog?.remove();
      openDialog = null;
    },
  };
}
