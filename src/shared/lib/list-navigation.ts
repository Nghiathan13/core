export type NavigableKey = "ArrowDown" | "ArrowUp" | "Home" | "End";

export function isNavigationKey(key: string): key is NavigableKey {
  return (
    key === "ArrowDown" || key === "ArrowUp" || key === "Home" || key === "End"
  );
}

export function isTriggerOpenKey(key: string): boolean {
  return key === "ArrowDown" || key === "ArrowUp";
}

export function isSelectKey(key: string): boolean {
  return key === "Enter" || key === " ";
}

/**
 * Calculates the next active item index in a list based on the navigation key press.
 * Supports cyclic wrapping for ArrowDown and ArrowUp.
 */
export function getNextActiveIndex(
  currentIndex: number,
  total: number,
  key: NavigableKey,
): number {
  if (total <= 0) {
    return -1;
  }

  switch (key) {
    case "ArrowDown":
      return currentIndex < 0 ? 0 : (currentIndex + 1) % total;
    case "ArrowUp":
      return currentIndex <= 0 ? total - 1 : (currentIndex - 1) % total;
    case "Home":
      return 0;
    case "End":
      return total - 1;
  }
}
