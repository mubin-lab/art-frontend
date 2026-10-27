import type { FrameOrientation, SizeOption } from "@/types";

export type { FrameOrientation };

export interface FrameVariantDef {
  type: FrameOrientation;
  name: string;
  subtitle: string;
  aspectRatio: string;
  tagline: string;
  description: string;
  ratioExplanation: string;
  sizes: {
    id: string;
    feetLabel?: string;
    hatLabel: string;
    dimensions: string;
    widthInch: number;
    heightInch: number;
    label: string;
    multiplier: number;
  }[];
}

export const FRAME_VARIANTS: Record<FrameOrientation, FrameVariantDef> = {
  horizontal: {
    type: "horizontal",
    name: "Horizontal Frame",
    subtitle: "Landscape (Width > Height)",
    aspectRatio: "3:2",
    tagline: "Width > Height · 3:2 Ratio",
    description: "Wide landscape canvas proportioned in classic 3:2 ratio",
    ratioExplanation: "Width 18″, 36″, 54″ · Height 12″, 24″, 36″",
    sizes: [
      {
        id: "1-hat",
        feetLabel: "1 Feet",
        hatLabel: "1 Feet",
        dimensions: "18 × 12″",
        widthInch: 18,
        heightInch: 12,
        label: "1 Feet (18 × 12″)",
        multiplier: 1.0,
      },
      {
        id: "2-hat",
        feetLabel: "2 Feet",
        hatLabel: "2 Feet",
        dimensions: "36 × 24″",
        widthInch: 36,
        heightInch: 24,
        label: "2 Feet (36 × 24″)",
        multiplier: 1.7,
      },
      {
        id: "3-hat",
        feetLabel: "3 Feet",
        hatLabel: "3 Feet",
        dimensions: "54 × 36″",
        widthInch: 54,
        heightInch: 36,
        label: "3 Feet (54 × 36″)",
        multiplier: 2.5,
      },
    ],
  },
  vertical: {
    type: "vertical",
    name: "Vertical Frame",
    subtitle: "Portrait (Height > Width)",
    aspectRatio: "2:3",
    tagline: "Height > Width · 2:3 Ratio",
    description: "Tall portrait canvas proportioned in traditional 2:3 vertical ratio",
    ratioExplanation: "Width 12″, 24″, 36″ · Height 18″, 36″, 54″",
    sizes: [
      {
        id: "1-hat",
        feetLabel: "1 Feet",
        hatLabel: "1 Feet",
        dimensions: "12 × 18″",
        widthInch: 12,
        heightInch: 18,
        label: "1 Feet (12 × 18″)",
        multiplier: 1.0,
      },
      {
        id: "2-hat",
        feetLabel: "2 Feet",
        hatLabel: "2 Feet",
        dimensions: "24 × 36″",
        widthInch: 24,
        heightInch: 36,
        label: "2 Feet (24 × 36″)",
        multiplier: 1.7,
      },
      {
        id: "3-hat",
        feetLabel: "3 Feet",
        hatLabel: "3 Feet",
        dimensions: "36 × 54″",
        widthInch: 36,
        heightInch: 54,
        label: "3 Feet (36 × 54″)",
        multiplier: 2.5,
      },
    ],
  },
  square: {
    type: "square",
    name: "Square Frame",
    subtitle: "Square (Equal Sides)",
    aspectRatio: "1:1",
    tagline: "Width = Height · 1:1 Ratio",
    description: "Balanced square canvas with equal width and height",
    ratioExplanation: "Equal dimensions: 18″ × 18″, 36″ × 36″, 54″ × 54″",
    sizes: [
      {
        id: "1-hat",
        feetLabel: "1 Feet",
        hatLabel: "1 Feet",
        dimensions: "18 × 18″",
        widthInch: 18,
        heightInch: 18,
        label: "1 Feet (18 × 18″)",
        multiplier: 1.0,
      },
      {
        id: "2-hat",
        feetLabel: "2 Feet",
        hatLabel: "2 Feet",
        dimensions: "36 × 36″",
        widthInch: 36,
        heightInch: 36,
        label: "2 Feet (36 × 36″)",
        multiplier: 1.7,
      },
      {
        id: "3-hat",
        feetLabel: "3 Feet",
        hatLabel: "3 Feet",
        dimensions: "54 × 54″",
        widthInch: 54,
        heightInch: 54,
        label: "3 Feet (54 × 54″)",
        multiplier: 2.5,
      },
    ],
  },
};

export function getVariantInfo(orientation?: FrameOrientation): FrameVariantDef {
  if (orientation && FRAME_VARIANTS[orientation]) {
    return FRAME_VARIANTS[orientation];
  }
  return FRAME_VARIANTS.horizontal;
}

export function getSizesForPainting(
  orientation: FrameOrientation = "horizontal",
  basePrice: number = 35880
): SizeOption[] {
  const variant = getVariantInfo(orientation);
  return variant.sizes.map((s, idx) => ({
    id: s.id,
    feetLabel: s.hatLabel,
    hatLabel: s.hatLabel,
    dimensions: s.dimensions,
    widthInch: s.widthInch,
    heightInch: s.heightInch,
    label: s.label,
    price: idx === 0 ? basePrice : Math.round(basePrice * s.multiplier),
  }));
}