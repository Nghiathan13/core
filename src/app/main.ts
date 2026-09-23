import { initLanguage } from "@/shared/i18n";
import { initTheme } from "@/shared/lib";
import { Sidebar } from "./layouts";
import { initRouter } from "./router";

initTheme();
initLanguage();

document.body.prepend(Sidebar().el);

const outlet = document.querySelector<HTMLElement>("main");

if (!outlet) {
  throw new Error('<main> outlet not found');
}

initRouter(outlet);
