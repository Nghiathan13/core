import { afterEach, describe, expect, it } from "vitest";
import { SettingsButton } from "./SettingsButton";

function openOverlays(): number {
  return document.body.querySelectorAll(".modal-overlay").length;
}

afterEach(() => {
  document.body
    .querySelectorAll(".modal-overlay")
    .forEach((overlay) => overlay.remove());
});

describe("SettingsButton", () => {
  it("exposes dialog trigger semantics", () => {
    const view = SettingsButton();
    expect(view.el.getAttribute("aria-haspopup")).toBe("dialog");
    expect(view.el.getAttribute("aria-expanded")).toBe("false");
    view.destroy?.();
  });

  it("opens dialog on click", () => {
    const view = SettingsButton();
    const el = view.el;
    const destroy = (): void => view.destroy?.();
    document.body.append(el);
    (el as HTMLButtonElement).click();
    expect(openOverlays()).toBe(1);
    expect(el.getAttribute("aria-expanded")).toBe("true");
    destroy();
    el.remove();
  });

  it("ignores clicks while dialog is open", () => {
    const view = SettingsButton();
    const el = view.el;
    const destroy = (): void => view.destroy?.();
    document.body.append(el);
    (el as HTMLButtonElement).click();
    (el as HTMLButtonElement).click();
    (el as HTMLButtonElement).click();
    expect(openOverlays()).toBe(1);
    destroy();
    el.remove();
  });

  it("reopens after dialog is closed", () => {
    const view = SettingsButton();
    const el = view.el;
    const destroy = (): void => view.destroy?.();
    document.body.append(el);
    (el as HTMLButtonElement).click();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(openOverlays()).toBe(0);
    expect(el.getAttribute("aria-expanded")).toBe("false");
    (el as HTMLButtonElement).click();
    expect(openOverlays()).toBe(1);
    destroy();
    el.remove();
  });

  it("removes open dialog on destroy", () => {
    const view = SettingsButton();
    const el = view.el;
    const destroy = (): void => view.destroy?.();
    document.body.append(el);
    (el as HTMLButtonElement).click();
    destroy();
    expect(openOverlays()).toBe(0);
    el.remove();
  });
});
