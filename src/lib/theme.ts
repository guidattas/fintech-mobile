// Paleta Movibank — espelha web/lib/movibank-colors.ts
export const theme = {
  color: {
    yellow: '#F4B400',
    yellowLight: '#FCC84D',
    yellowDark: '#D99B00',
    yellowSoft: '#FEF3E2',
    yellowText: '#B78100',

    // grays
    bg: '#F7F7F5',
    surface: '#FFFFFF',
    surfaceAlt: '#FAFAF9',
    border: '#ECECEA',
    borderStrong: '#D4D4D8',

    // text
    text: '#111827',
    textMuted: '#6B7280',
    textSubtle: '#9CA3AF',
    textFaint: '#D1D5DB',

    // dark surfaces
    dark: '#111827',
    darkAlt: '#1F2937',
    darkBorder: '#374151',
    darkText: '#FFFFFF',

    // status
    success: '#10B981',
    successBg: '#ECFDF5',
    successText: '#059669',
    danger: '#EF4444',
    dangerBg: '#FEE2E2',
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  font: {
    weightNormal: '400' as const,
    weightMedium: '500' as const,
    weightSemi: '600' as const,
    weightBold: '700' as const,
    weightBlack: '800' as const,
  },
}
