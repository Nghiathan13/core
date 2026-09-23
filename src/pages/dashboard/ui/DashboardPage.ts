import { t } from "@/shared/i18n";
import type { View } from "@/shared/lib";

export function DashboardPage(): View {
  const section = document.createElement("section");

  const heading = document.createElement("h1");
  heading.textContent = t("dashboard");
  heading.setAttribute("data-i18n", "dashboard");

  section.append(heading);

  return { el: section };
}
