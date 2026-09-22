export function DashboardPage(): HTMLElement {
  const section = document.createElement("section");

  const heading = document.createElement("h1");
  heading.textContent = "dashboard";

  section.append(heading);

  return section;
}
