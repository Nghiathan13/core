import { initRouter } from "./router";
import { initTheme } from "./theme/theme";

initTheme();

const outlet = document.querySelector<HTMLElement>("main");

if (!outlet) {
  throw new Error('<main> outlet not found');
}

initRouter(outlet);
