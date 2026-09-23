import { t } from "../../i18n";
import "./Modal.css";

interface ModalOptions {
  titleKey: string;
  body?: HTMLElement;
  onClose?: () => void;
}

export function Modal({ titleKey, body, onClose }: ModalOptions): HTMLElement {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const dialog = document.createElement("div");
  dialog.className = "modal";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.tabIndex = -1;
  const title = t(titleKey);
  dialog.setAttribute("aria-label", title);

  if (body) {
    dialog.append(body);
  }

  overlay.append(dialog);

  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  function focusables(): HTMLElement[] {
    return [...dialog.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")].filter(
      (element) => !element.hasAttribute("disabled"),
    );
  }

  function close(): void {
    window.removeEventListener("keydown", onKey);
    overlay.remove();
    if (previousFocus?.isConnected) {
      previousFocus.focus();
    }
    onClose?.();
  }

  function onKey(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key === "Tab") {
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      close();
    }
  });
  window.addEventListener("keydown", onKey);

  queueMicrotask(() => {
    if (dialog.isConnected) {
      const items = focusables();
      (items[0] ?? dialog).focus();
    }
  });

  return overlay;
}
