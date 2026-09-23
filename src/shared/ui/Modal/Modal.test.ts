import { afterEach, describe, expect, it } from "vitest";
import { Modal } from "./Modal";

function pressKey(key: string, init?: KeyboardEventInit): void {
  window.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key, ...init }));
}

afterEach(() => {
  document.body.querySelectorAll(".modal-overlay").forEach((overlay) => overlay.remove());
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
    document.body.append(Modal({ titleKey: "setting", onClose: () => (closed += 1) }));
    pressKey("Escape");
    expect(closed).toBe(1);
  });
});
