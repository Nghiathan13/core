export type OverlayTier = "modal" | "dropdown" | "tooltip";

export interface OverlayRegistration {
  tier: OverlayTier;
  id?: string;
  onDismiss?: () => void;
}

export interface OverlayHandle {
  id: string;
  tier: OverlayTier;
  zIndex: number;
  release: () => void;
  hasOverlaysAbove: () => boolean;
}
