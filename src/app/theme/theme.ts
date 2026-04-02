import { createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'orange',
  fontFamily: 'Segoe UI, Trebuchet MS, sans-serif',
  headings: {
    fontFamily: 'Segoe UI, Trebuchet MS, sans-serif',
  },
  colors: {
    orange: [
      '#fff4e8',
      '#ffe8cc',
      '#ffd09d',
      '#fcb56c',
      '#f99d40',
      '#f78f26',
      '#f78716',
      '#dc7309',
      '#c46304',
      '#ab5400',
    ],
  },
  defaultRadius: 'lg',
  black: '#161616',
  white: '#ffffff',
  primaryShade: 5,
})
