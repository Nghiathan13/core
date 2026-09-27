import { afterEach, describe, expect, it, vi } from "vitest";
import { Dropdown } from "./Dropdown";

afterEach(() => {
  document.body.innerHTML = "";
});

function setup(): { onSelect: (value: "vi" | "en") => void } {
  const onSelect = vi.fn<(value: "vi" | "en") => void>();
  return { onSelect };
}

describe("Dropdown", () => {
  it("renders trigger with current option", () => {
    const { onSelect } = setup();
    const view = Dropdown({
      label: "Language",
      options: [
        { value: "vi", label: "VI", i18nKey: "vietnamese" },
        { value: "en", label: "EN", i18nKey: "english" },
      ],
      value: "vi",
      onSelect,
    });
    document.body.append(view.el);
    expect(view.getValue()).toBe("vi");
    expect(
      view.el.querySelector(".dropdown-trigger")?.getAttribute("aria-expanded"),
    ).toBe("false");
    expect(
      view.el.querySelector(".dropdown-trigger")?.getAttribute("aria-haspopup"),
    ).toBe("listbox");
    view.destroy?.();
  });

  it("opens menu and selects option on click", () => {
    const { onSelect } = setup();
    const view = Dropdown({
      label: "Language",
      options: [
        { value: "vi", label: "Tiếng Việt" },
        { value: "en", label: "English" },
      ],
      value: "vi",
      onSelect,
    });
    document.body.append(view.el);
    const trigger =
      view.el.querySelector<HTMLButtonElement>(".dropdown-trigger");
    trigger?.click();
    const menu = document.body.querySelector(".dropdown-menu");
    expect(menu?.getAttribute("role")).toBe("listbox");
    const options = [
      ...document.body.querySelectorAll<HTMLButtonElement>(".dropdown-option"),
    ];
    expect(options.length).toBe(2);
    options[1]?.click();
    expect(onSelect).toHaveBeenCalledWith("en");
    expect(view.getValue()).toBe("en");
    expect(document.body.querySelector(".dropdown-menu")).toBeNull();
    view.destroy?.();
  });

  it("closes on Escape and returns focus to trigger", () => {
    const { onSelect } = setup();
    const view = Dropdown({
      label: "Language",
      options: [
        { value: "vi", label: "VI" },
        { value: "en", label: "EN" },
      ],
      value: "vi",
      onSelect,
    });
    document.body.append(view.el);
    view.el.querySelector<HTMLButtonElement>(".dropdown-trigger")?.click();
    expect(document.body.querySelector(".dropdown-menu")).not.toBeNull();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(document.body.querySelector(".dropdown-menu")).toBeNull();
    expect(document.activeElement).toBe(
      view.el.querySelector(".dropdown-trigger"),
    );
    view.destroy?.();
  });

  it("closes on outside pointerdown", () => {
    const { onSelect } = setup();
    const view = Dropdown({
      label: "Language",
      options: [
        { value: "vi", label: "VI" },
        { value: "en", label: "EN" },
      ],
      value: "vi",
      onSelect,
    });
    document.body.append(view.el);
    view.el.querySelector<HTMLButtonElement>(".dropdown-trigger")?.click();
    expect(document.body.querySelector(".dropdown-menu")).not.toBeNull();
    document.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    expect(document.body.querySelector(".dropdown-menu")).toBeNull();
    view.destroy?.();
  });

  it("supports setValue and removes menu on destroy", () => {
    const { onSelect } = setup();
    const view = Dropdown({
      label: "Language",
      options: [
        { value: "vi", label: "VI" },
        { value: "en", label: "EN" },
      ],
      value: "vi",
      onSelect,
    });
    document.body.append(view.el);
    view.setValue("en");
    expect(view.getValue()).toBe("en");
    view.el.querySelector<HTMLButtonElement>(".dropdown-trigger")?.click();
    expect(document.body.querySelector(".dropdown-menu")).not.toBeNull();
    view.destroy?.();
    expect(document.body.querySelector(".dropdown-menu")).toBeNull();
  });
});
