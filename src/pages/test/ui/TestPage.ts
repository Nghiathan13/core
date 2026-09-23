import { t } from "@/shared/i18n";
import type { View } from "@/shared/lib";

export function TestPage(): View {
  const section = document.createElement("section");

  const heading = document.createElement("h1");
  heading.textContent = t("test");
  heading.setAttribute("data-i18n", "test");

  section.append(heading);

  return { el: section };
}
