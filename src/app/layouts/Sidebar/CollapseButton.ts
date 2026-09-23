import { PanelLeftClose, PanelLeftOpen, createElement } from "lucide";
import { t } from "@/shared/i18n";
import type { View } from "@/shared/lib";
import { Button, attachTooltip } from "@/shared/ui";
import { isCollapsed, setCollapsed, subscribeCollapse } from "./collapse";

export function CollapseButton(): View {
  const button = Button({
    icon: createElement(PanelLeftClose),
    label: "Collapse sidebar",
    hideLabel: true,
    onClick: () => {
      setCollapsed(!isCollapsed());
      // hide-on-click fires during dispatch, so re-show after it.
      queueMicrotask(() => tooltip.show());
    },
  });

  const tooltip = attachTooltip(button, {
    text: () => t(isCollapsed() ? "expand" : "collapse"),
    placement: () => (isCollapsed() ? "right" : "bottom"),
  });

  const sync = (): void => {
    const collapsed = isCollapsed();
    button.querySelector("svg")?.replaceWith(createElement(collapsed ? PanelLeftOpen : PanelLeftClose));
    button.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
    tooltip.refresh();
  };

  sync();
  const unsubscribe = subscribeCollapse(sync);

  return { el: button, destroy: () => { unsubscribe(); tooltip.detach(); } };
}
