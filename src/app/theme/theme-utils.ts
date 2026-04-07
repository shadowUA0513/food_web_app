import type { MantineTheme } from '@mantine/core'

function getPrimaryShadeIndex(theme: MantineTheme, isDark: boolean) {
  if (typeof theme.primaryShade === 'number') {
    return theme.primaryShade
  }

  return isDark ? theme.primaryShade.dark : theme.primaryShade.light
}

export function getPrimaryColorTokens(theme: MantineTheme, isDark: boolean) {
  const palette = theme.colors[theme.primaryColor] ?? theme.colors.blue
  const shade = getPrimaryShadeIndex(theme, isDark)

  return {
    filled: palette[shade],
    filledHover: palette[Math.min(shade + 1, 9)],
    outline: palette[Math.max(shade - 1, 0)],
    light: palette[Math.max(shade - 4, 0)],
    lightHover: palette[Math.max(shade - 3, 0)],
    dark: palette[Math.min(shade + 2, 9)],
  }
}
