export function TestPage(): HTMLElement {
  const section = document.createElement("section");

  const heading = document.createElement("h1");
  heading.textContent = "test";

  section.append(heading);

  return section;
}
