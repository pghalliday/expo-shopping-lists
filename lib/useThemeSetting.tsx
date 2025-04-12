import {database} from "~/model/database";
import {useEffect, useState} from "react";

export type ThemeSetting = 'light' | 'dark' | 'system';
export const DEFAULT_THEME_SETTING: ThemeSetting = 'system';

export function useThemeSetting() {
  const [ themeSetting, setThemeSetting ] = useState<ThemeSetting>(DEFAULT_THEME_SETTING);

  useEffect(() => {
    database.localStorage.get<ThemeSetting>('theme')
        .then((theme) => setThemeSetting(theme ?? DEFAULT_THEME_SETTING));
  }, []);

  return {
    themeSetting,
    setThemeSetting: (theme: ThemeSetting) => {
      database.localStorage.set<ThemeSetting>('theme', theme)
          .then(() => setThemeSetting(theme));
    },
  };
}
