import { t } from "@/shared/i18n";

export function DashboardPage(): HTMLElement {
  const section = document.createElement("section");

  const heading = document.createElement("h1");
  heading.textContent = t("dashboard");
  heading.setAttribute("data-i18n", "dashboard");

  section.append(heading);

  return section;
}
