// Определяем тип темы, включая нашу новую "болотную"
type Theme = "light" | "dark" | "swamp"

const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const currentTheme = (localStorage.getItem("theme") as Theme) ?? userPref
document.documentElement.setAttribute("saved-theme", currentTheme)

const emitThemeChangeEvent = (theme: Theme) => {
  // Мы используем as any здесь, чтобы не переписывать глобальные интерфейсы Quartz,
  // если они жестко ограничены парой light|dark
  const event: any = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  const switchTheme = () => {
    const attr = document.documentElement.getAttribute("saved-theme") as Theme

    // Логика циклического переключения
    let newTheme: Theme
    if (attr === "light") {
      newTheme = "dark"
    } else if (attr === "dark") {
      newTheme = "swamp"
    } else {
      newTheme = "light"
    }

    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  const themeChange = (e: MediaQueryListEvent) => {
    // Системные изменения всё еще мапим на стандартные темы
    const newTheme: Theme = e.matches ? "dark" : "light"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  for (const darkmodeButton of document.getElementsByClassName("darkmode")) {
    darkmodeButton.addEventListener("click", switchTheme)
    window.addCleanup(() => darkmodeButton.removeEventListener("click", switchTheme))
  }

  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorSchemeMediaQuery.addEventListener("change", themeChange)
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", themeChange))
})
