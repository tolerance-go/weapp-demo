import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import Themes from '../themes'
import { GeistUIThemes } from '../themes/presets'
import { ThemeContext } from '../use-theme/theme-context'
import { AllThemesConfig, AllThemesContext } from '../use-all-themes/all-themes-context'

export interface Props {
  themeType?: string
  themes?: Array<GeistUIThemes>
}

const getAccThemes = (themes: GeistUIThemes[]) => {
  // 有了 extendTheme api 后，theme 的名称是允许重复的，所以注释掉
  // const safeThemes = themes.filter(item => Themes.isAvailableThemeType(item.type))
  const nextThemes = Themes.getPresets()
    // 如果有自定义 theme 和 preset theme 重名，使用 custom
    .filter(item => !themes.find(theme => theme.type === item.type))
    .concat(themes)
  return nextThemes
}

const ThemeProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  themeType,
  themes = [],
}) => {
  const [allThemes, setAllThemes] = useState<AllThemesConfig>(() => {
    if (!themes?.length)
      return {
        themes: Themes.getPresets(),
      }
    return {
      themes: getAccThemes(themes),
    }
  })

  const currentTheme = useMemo<GeistUIThemes>(() => {
    const theme = allThemes.themes.find(item => item.type === themeType)
    if (theme) return theme
    return Themes.getPresetStaticTheme()
  }, [allThemes, themeType])

  useEffect(() => {
    if (!themes?.length) return
    setAllThemes(last => {
      // 有了 extendTheme api 后，theme 的名称是允许重复的，所以注释掉
      // const safeThemes = themes.filter(item => Themes.isAvailableThemeType(item.type))
      const nextThemes = getAccThemes(themes)
      return {
        ...last,
        themes: nextThemes,
      }
    })
  }, [themes])

  return (
    <AllThemesContext.Provider value={allThemes}>
      <ThemeContext.Provider value={currentTheme}>{children}</ThemeContext.Provider>
    </AllThemesContext.Provider>
  )
}

export default ThemeProvider
