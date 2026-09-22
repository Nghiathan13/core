export function initTheme(): void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const apply = (): void => {
    document.documentElement.setAttribute("data-theme", media.matches ? "dark" : "light");
  };

  apply();
  media.addEventListener("change", apply);
}
