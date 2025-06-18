import { ThemeProvider } from "@/components/theme-provider"

import AppRouter from './router';

function App() {
    return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AppRouter />
    </ThemeProvider>
  )
}

export default App;
