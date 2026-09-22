import { initTheme } from "@/shared/lib";
import { Sidebar } from "@/shared/ui";
import { initRouter } from "./router";

initTheme();

document.body.prepend(Sidebar());

const outlet = document.querySelector<HTMLElement>("main");

if (!outlet) {
  throw new Error('<main> outlet not found');
}

initRouter(outlet);
