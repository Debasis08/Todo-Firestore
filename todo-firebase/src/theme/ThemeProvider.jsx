//ThemeProvider.jsx

import { ChakraProvider } from "@chakra-ui/react";
import * as theme from "./theme";

export function ThemeProvider({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}