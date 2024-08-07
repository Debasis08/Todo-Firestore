// theme.js

import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config
const config = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

const colors = {
  textColor: "#f2623b",
  backgroundColor: "#ccccff",
}

// 3. extend the theme
const theme = extendTheme({ config, colors })

export default theme