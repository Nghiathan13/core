import { DashboardPage } from "@/pages/dashboard";
import { TestPage } from "@/pages/test";
import { getCurrentPath } from "@/shared/lib";
import type { View } from "@/shared/lib";

type PageRenderer = () => HTMLElement | View;

interface Route {
  path: string;
  render: PageRenderer;
}

const routes: Route[] = [
  { path: "/", render: DashboardPage },
  { path: "/dashboard", render: DashboardPage },
  { path: "/test", render: TestPage },
];

function renderNotFound(path: string): HTMLElement {
  const section = document.createElement("section");
  section.innerHTML = `<h1>404</h1><p>Route "${path}" not found.</p><a href="#/">Back to dashboard</a>`;
  return section;
}

function isView(node: HTMLElement | View): node is View {
  return !(node instanceof HTMLElement);
}

function mount(outlet: HTMLElement, node: HTMLElement | View): (() => void) | undefined {
  if (isView(node)) {
    outlet.replaceChildren(node.el);
    return node.destroy;
  }
  outlet.replaceChildren(node);
  return undefined;
}

export function initRouter(outlet: HTMLElement): () => void {
  let currentDestroy: (() => void) | undefined;
  const controller = new AbortController();

  const render = (): void => {
    currentDestroy?.();
    const path = getCurrentPath();
    const match = routes.find((route) => route.path === path);
    const node = match ? match.render() : renderNotFound(path);
    currentDestroy = mount(outlet, node);
  };

  window.addEventListener("hashchange", render, { signal: controller.signal });
  render();

  return () => {
    controller.abort();
    currentDestroy?.();
  };
}

export function navigate(path: string): void {
  window.location.hash = `#${path}`;
}
