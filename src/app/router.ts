import { DashboardPage } from "@/pages/dashboard";
import { TestPage } from "@/pages/test";
import { getCurrentPath } from "@/shared/lib";

type PageRenderer = () => HTMLElement;

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

function render(outlet: HTMLElement): void {
  const path = getCurrentPath();
  const match = routes.find((route) => route.path === path);
  outlet.replaceChildren(match ? match.render() : renderNotFound(path));
}

export function initRouter(outlet: HTMLElement): void {
  window.addEventListener("hashchange", () => render(outlet));
  render(outlet);
}

export function navigate(path: string): void {
  window.location.hash = `#${path}`;
}
