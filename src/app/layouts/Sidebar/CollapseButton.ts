import { PanelLeftClose, PanelLeftOpen, createElement } from "lucide";
import type { View } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { isCollapsed, setCollapsed, subscribeCollapse } from "./collapse";

export function CollapseButton(): View {
  const button = Button({
    icon: createElement(PanelLeftClose),
    label: "Collapse sidebar",
    hideLabel: true,
    onClick: () => setCollapsed(!isCollapsed()),
  });

  const sync = (): void => {
    const collapsed = isCollapsed();
    button.querySelector("svg")?.replaceWith(createElement(collapsed ? PanelLeftOpen : PanelLeftClose));
    button.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
  };

  sync();
  const unsubscribe = subscribeCollapse(sync);

  return { el: button, destroy: unsubscribe };
}
