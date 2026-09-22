import { t } from "@/shared/i18n";

export function TestPage(): HTMLElement {
  const section = document.createElement("section");

  const heading = document.createElement("h1");
  heading.textContent = t("test");
  heading.setAttribute("data-i18n", "test");

  section.append(heading);

  return section;
}
