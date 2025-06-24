import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {LocalStorageService} from "~/lib/services/LocalStorageService";
import assert from "assert";

export type ThemeSetting = 'light' | 'dark' | 'system';
export const DEFAULT_THEME_SETTING: ThemeSetting = 'system';

const themeSettingContext = createContext<ThemeSetting | undefined>(undefined);
const themeSettingStorageContext = createContext<LocalStorageService<ThemeSetting> | undefined>(undefined);

export function ThemeSettingProvider({storage, children}: PropsWithChildren<{
    storage: LocalStorageService<ThemeSetting>
}>) {
    const [themeSetting, setThemeSetting] = useState<ThemeSetting>();

    useEffect(() => {
        storage.onValue(value => setThemeSetting(value));
    }, []);

    return (
        <themeSettingStorageContext.Provider value={storage}>
            <themeSettingContext.Provider value={themeSetting}>
                {children}
            </themeSettingContext.Provider>
        </themeSettingStorageContext.Provider>
    );
}

export function useThemeSetting() {
    const storage = useContext(themeSettingStorageContext);
    assert(storage, 'Attempted to call useThemeSetting() outside of <ThemeSettingProvider>');
    return {
        themeSetting: useContext(themeSettingContext) ?? DEFAULT_THEME_SETTING,
        setThemeSetting: (value: ThemeSetting) => storage.set(value),
    };
}
