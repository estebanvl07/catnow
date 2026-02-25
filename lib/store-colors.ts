/**
 * Valores HSL (sin "hsl()") para el color principal del catálogo.
 * Se aplican como variables CSS para --primary, --primary-foreground, etc.
 */
const STORE_COLOR_PALETTES: Record<
  string,
  { primary: string; primaryForeground: string; accent: string; ring: string }
> = {
  indigo: {
    primary: "238 84% 53%",
    primaryForeground: "0 0% 98%",
    accent: "238 84% 53%",
    ring: "238 84% 53%",
  },
  blue: {
    primary: "217 91% 60%",
    primaryForeground: "0 0% 98%",
    accent: "217 91% 60%",
    ring: "217 91% 60%",
  },
  emerald: {
    primary: "160 84% 39%",
    primaryForeground: "0 0% 98%",
    accent: "160 84% 39%",
    ring: "160 84% 39%",
  },
  rose: {
    primary: "347 77% 50%",
    primaryForeground: "0 0% 98%",
    accent: "347 77% 50%",
    ring: "347 77% 50%",
  },
  amber: {
    primary: "38 92% 50%",
    primaryForeground: "0 0% 9%",
    accent: "38 92% 50%",
    ring: "38 92% 50%",
  },
  slate: {
    primary: "215 28% 35%",
    primaryForeground: "0 0% 98%",
    accent: "215 28% 35%",
    ring: "215 28% 35%",
  },
}

const DEFAULT_PALETTE = STORE_COLOR_PALETTES.indigo

export function getStoreColorStyles(primaryColor: string): Record<string, string> {
  const palette =
    STORE_COLOR_PALETTES[primaryColor] ?? DEFAULT_PALETTE
  return {
    "--primary": palette.primary,
    "--primary-foreground": palette.primaryForeground,
    "--accent": palette.accent,
    "--accent-foreground": palette.primaryForeground,
    "--ring": palette.ring,
    "--chart-1": palette.primary,
  }
}

export const STORE_COLOR_OPTIONS = [
  { value: "indigo", label: "Indigo" },
  { value: "blue", label: "Azul" },
  { value: "emerald", label: "Esmeralda" },
  { value: "rose", label: "Rosa" },
  { value: "amber", label: "Ámbar" },
  { value: "slate", label: "Slate" },
] as const
