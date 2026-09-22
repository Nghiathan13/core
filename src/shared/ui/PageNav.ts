const LINKS = [
  { path: "/", label: "dashboard" },
  { path: "/test", label: "test" },
];

export function PageNav(): HTMLElement {
  const nav = document.createElement("nav");

  for (const { path, label } of LINKS) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => {
      window.location.hash = `#${path}`;
    });
    nav.append(button);
  }

  return nav;
}
