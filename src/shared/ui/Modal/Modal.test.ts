import { afterEach, describe, expect, it, vi } from "vitest";
import { Dropdown } from "../Dropdown";
import { Modal } from "./Modal";

function pressKey(key: string, init?: KeyboardEventInit): void {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key,
      ...init,
    }),
  );
}

afterEach(() => {
  document.body
    .querySelectorAll(".modal-overlay, .dropdown-menu, .dropdown")
    .forEach((overlay) => overlay.remove());
});

describe("Modal focus", () => {
  it("moves focus to first control on open", async () => {
    const body = document.createElement("div");
    const first = document.createElement("button");
    first.textContent = "first";
    body.append(first);
    document.body.append(Modal({ titleKey: "setting", body }));
    await Promise.resolve();
    expect(document.activeElement).toBe(first);
    pressKey("Escape");
  });

  it("wraps Tab from last control to first", async () => {
    const body = document.createElement("div");
    const first = document.createElement("button");
    const last = document.createElement("button");
    body.append(first, last);
    document.body.append(Modal({ titleKey: "setting", body }));
    await Promise.resolve();
    last.focus();
    pressKey("Tab");
    expect(document.activeElement).toBe(first);
    pressKey("Escape");
  });

  it("wraps Shift+Tab from first control to last", async () => {
    const body = document.createElement("div");
    const first = document.createElement("button");
    const last = document.createElement("button");
    body.append(first, last);
    document.body.append(Modal({ titleKey: "setting", body }));
    await Promise.resolve();
    first.focus();
    pressKey("Tab", { shiftKey: true });
    expect(document.activeElement).toBe(last);
    pressKey("Escape");
  });

  it("returns focus to trigger on close", async () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();
    const body = document.createElement("div");
    body.append(document.createElement("button"));
    document.body.append(Modal({ titleKey: "setting", body }));
    await Promise.resolve();
    pressKey("Escape");
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it("notifies onClose", () => {
    let closed = 0;
    document.body.append(
      Modal({ titleKey: "setting", onClose: () => (closed += 1) }),
    );
    pressKey("Escape");
    expect(closed).toBe(1);
  });
});

describe("Modal stacked dismiss", () => {
  function openDropdown(): void {
    const view = Dropdown({
      label: "Language",
      options: [
        { value: "vi", label: "VI" },
        { value: "en", label: "EN" },
      ],
      value: "vi",
      onSelect: vi.fn(),
    });
    document.body.append(view.el);
    view.el.querySelector<HTMLButtonElement>(".dropdown-trigger")?.click();
  }

  function pressScrim(overlay: HTMLElement): void {
    overlay.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    overlay.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }

  it("keeps modal open when scrim click also dismisses dropdown", () => {
    const overlay = Modal({
      titleKey: "setting",
      body: document.createElement("div"),
    });
    document.body.append(overlay);
    openDropdown();
    expect(document.body.querySelector(".dropdown-menu")).not.toBeNull();
    pressScrim(overlay);
    expect(document.body.querySelector(".dropdown-menu")).toBeNull();
    expect(overlay.isConnected).toBe(true);
    pressScrim(overlay);
    expect(overlay.isConnected).toBe(false);
  });

  it("keeps modal open when Escape dismisses dropdown", () => {
    const overlay = Modal({
      titleKey: "setting",
      body: document.createElement("div"),
    });
    document.body.append(overlay);
    openDropdown();
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(document.body.querySelector(".dropdown-menu")).toBeNull();
    expect(overlay.isConnected).toBe(true);
    pressKey("Escape");
    expect(overlay.isConnected).toBe(false);
  });
});
