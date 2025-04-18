import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {LocalStorageService} from "~/lib/AppProviders/LocalStorageService";

export type ThemeSetting = 'light' | 'dark' | 'system';
export const DEFAULT_THEME_SETTING: ThemeSetting = 'system';

const themeSettingContext = createContext<ThemeSetting>(DEFAULT_THEME_SETTING);
const themeSettingStorage = new LocalStorageService<ThemeSetting>('theme', DEFAULT_THEME_SETTING);

export function ThemeSettingProvider({children}: PropsWithChildren<{}>) {
  const [ themeSetting, setThemeSetting ] = useState<ThemeSetting>(DEFAULT_THEME_SETTING);

  useEffect(() => {
    themeSettingStorage.onValue(value => setThemeSetting(value));
  }, []);

  return (
      <themeSettingContext.Provider value={themeSetting}>
        {children}
      </themeSettingContext.Provider>
  );
}

export function useThemeSetting() {
  return {
    themeSetting: useContext(themeSettingContext),
    setThemeSetting: (value: ThemeSetting) => themeSettingStorage.set(value),
  };
}
