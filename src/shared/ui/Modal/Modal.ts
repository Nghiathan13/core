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
  const title = t(titleKey);
  dialog.setAttribute("aria-label", title);

  if (body) {
    dialog.append(body);
  }

  overlay.append(dialog);

  function close(): void {
    window.removeEventListener("keydown", onKey);
    overlay.remove();
    onClose?.();
  }

  function onKey(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      close();
    }
  }

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      close();
    }
  });
  window.addEventListener("keydown", onKey);

  return overlay;
}
