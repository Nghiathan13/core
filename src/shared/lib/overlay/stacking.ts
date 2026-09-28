import type { OverlayHandle, OverlayRegistration, OverlayTier } from "./types";

export const BASE_TIERS: Record<OverlayTier, number> = {
  modal: 1000,
  dropdown: 1100,
  tooltip: 1200,
};

const TIER_STEP = 10;

interface ActiveOverlayEntry {
  id: string;
  tier: OverlayTier;
  onDismiss?: () => void;
}

let activeOverlays: ActiveOverlayEntry[] = [];
let autoId = 0;

export function acquireOverlay(
  registration: OverlayRegistration,
): OverlayHandle {
  const id = registration.id ?? `overlay-${++autoId}`;

  // If an overlay with the same ID already exists, release it first
  releaseOverlay(id);

  const tierCount = activeOverlays.filter(
    (item) => item.tier === registration.tier,
  ).length;
  const zIndex = BASE_TIERS[registration.tier] + tierCount * TIER_STEP;

  activeOverlays.push({
    id,
    tier: registration.tier,
    onDismiss: registration.onDismiss,
  });

  return {
    id,
    tier: registration.tier,
    zIndex,
    release: () => releaseOverlay(id),
    hasOverlaysAbove: () => hasActiveOverlaysAbove(registration.tier, id),
  };
}

export function releaseOverlay(id: string): void {
  activeOverlays = activeOverlays.filter((item) => item.id !== id);
}

export function hasActiveOverlaysAbove(
  tier: OverlayTier,
  id?: string,
): boolean {
  if (id !== undefined) {
    const index = activeOverlays.findIndex((item) => item.id === id);
    if (index !== -1) {
      return index < activeOverlays.length - 1;
    }
  }
  const currentBase = BASE_TIERS[tier];
  return activeOverlays.some((item) => BASE_TIERS[item.tier] > currentBase);
}

export function dismissTopOverlay(): boolean {
  const top = activeOverlays[activeOverlays.length - 1];
  if (!top) {
    return false;
  }
  if (top.onDismiss) {
    top.onDismiss();
    return true;
  }
  releaseOverlay(top.id);
  return true;
}

export function getActiveOverlaysCount(): number {
  return activeOverlays.length;
}

export function resetStackingForTesting(): void {
  activeOverlays = [];
  autoId = 0;
}
