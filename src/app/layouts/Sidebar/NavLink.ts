import { t } from "@/shared/i18n";

interface NavLinkOptions {
  path: string;
  i18nKey: string;
  icon: Element;
  current?: boolean;
}

export function NavLink({
  path,
  i18nKey,
  icon,
  current,
}: NavLinkOptions): HTMLAnchorElement {
  const link = document.createElement("a");
  link.className = "button state-layer";
  link.href = `#${path}`;
  if (current) {
    link.setAttribute("aria-current", "page");
  }
  link.append(icon);
  const text = document.createElement("span");
  text.textContent = t(i18nKey);
  text.setAttribute("data-i18n", i18nKey);
  link.append(text);
  return link;
}
