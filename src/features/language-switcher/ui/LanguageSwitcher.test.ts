import { afterEach, describe, expect, it } from "vitest";
import { getLanguage, getLanguageMode, setLanguage } from "@/shared/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("LanguageSwitcher dropdown", () => {
  it("renders General header and Language subheader", () => {
    setLanguage("en");
    const view = LanguageSwitcher();
    document.body.append(view.el);
    expect(view.el.querySelector(".settings-section-header")?.textContent).toBe(
      "General",
    );
    expect(view.el.querySelector(".language-switcher-title")?.textContent).toBe(
      "Language",
    );
    expect(view.el.querySelector(".dropdown-trigger")).not.toBeNull();
    view.destroy?.();
  });

  it("lists auto detect plus fixed native names", () => {
    setLanguage("en");
    const view = LanguageSwitcher();
    document.body.append(view.el);
    view.el.querySelector<HTMLButtonElement>(".dropdown-trigger")?.click();
    const options = [
      ...document.body.querySelectorAll<HTMLButtonElement>(".dropdown-option"),
    ];
    expect(options.map((item) => item.dataset.value)).toEqual([
      "system",
      "vi",
      "en",
    ]);
    expect(options.map((item) => item.textContent)).toEqual([
      "Auto detect",
      "Tiếng Việt",
      "English",
    ]);
    view.destroy?.();
  });

  it("changes language by selecting dropdown option", () => {
    setLanguage("vi");
    const view = LanguageSwitcher();
    document.body.append(view.el);
    view.el.querySelector<HTMLButtonElement>(".dropdown-trigger")?.click();
    const options = [
      ...document.body.querySelectorAll<HTMLButtonElement>(".dropdown-option"),
    ];
    expect(options.length).toBe(3);
    options.find((item) => item.dataset.value === "en")?.click();
    expect(getLanguage()).toBe("en");
    view.destroy?.();
  });

  it("selects auto detect mode", () => {
    setLanguage("en");
    const view = LanguageSwitcher();
    document.body.append(view.el);
    view.el.querySelector<HTMLButtonElement>(".dropdown-trigger")?.click();
    [...document.body.querySelectorAll<HTMLButtonElement>(".dropdown-option")]
      .find((item) => item.dataset.value === "system")
      ?.click();
    expect(getLanguageMode()).toBe("system");
    view.destroy?.();
  });

  it("removes dropdown menu on destroy", () => {
    setLanguage("en");
    const view = LanguageSwitcher();
    document.body.append(view.el);
    view.el.querySelector<HTMLButtonElement>(".dropdown-trigger")?.click();
    expect(document.body.querySelector(".dropdown-menu")).not.toBeNull();
    view.destroy?.();
    expect(document.body.querySelector(".dropdown-menu")).toBeNull();
  });
});
