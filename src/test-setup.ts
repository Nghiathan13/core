import { expect } from "vitest";
import { configureAxe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";

expect.extend(matchers);

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
