"use client"

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react"

export type Theme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export const THEME_STORAGE_KEY = "salonbook-theme"

/**
 * The source of truth for the theme is the `dark` class on <html>, applied
 * before hydration by the inline script in `src/app/layout.tsx` (prevents
 * dark-mode flash). Reading it through useSyncExternalStore keeps React in
 * sync with that external state without an effect-driven setState.
 */
const themeStore = {
  subscribe(onChange: () => void) {
    const observer = new MutationObserver(onChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  },
  getSnapshot(): Theme {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  },
  getServerSnapshot(): Theme {
    return "light"
  },
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  )

  const toggleTheme = useCallback(() => {
    const next: Theme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark"
    document.documentElement.classList.toggle("dark", next === "dark")
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage unavailable (private mode etc.) — theme still applies for the session.
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within <ThemeProvider>")
  }
  return context
}
