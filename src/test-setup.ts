import { expect } from "vitest";
import { configureAxe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";

expect.extend(matchers);

// Set default viewport dimensions for happy-dom DOM measurements (used by Floating UI)
Object.defineProperty(document.documentElement, "clientWidth", {
  value: 1024,
  configurable: true,
  writable: true,
});
Object.defineProperty(document.documentElement, "clientHeight", {
  value: 768,
  configurable: true,
  writable: true,
});

/**
 * Strict axe configuration enforcing WCAG 2.0, 2.1, 2.2 Level A, AA, AAA
 * and Deque accessibility best practices with zero ignored rules.
 */
export const strictAxe = configureAxe({
  runOnly: {
    type: "tag",
    values: [
      "wcag2a",
      "wcag2aa",
      "wcag2aaa",
      "wcag21a",
      "wcag21aa",
      "wcag21aaa",
      "wcag22aa",
      "best-practice",
    ],
  },
});
