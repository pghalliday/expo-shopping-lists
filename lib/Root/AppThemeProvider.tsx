import * as React from "react";
import {PropsWithChildren, useEffect, useLayoutEffect, useRef, useState} from "react";
import {DarkTheme, DefaultTheme, Theme, ThemeProvider} from "@react-navigation/native";
import {useColorScheme} from "~/lib/useColorScheme";
import {NAV_THEME} from "~/lib/constants";
import {useThemeSetting} from "~/lib/Root/ThemeSettingProvider";
import {setAndroidNavigationBar} from "~/lib/android-navigation-bar";
import {Platform} from "react-native";

const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
};

export function AppThemeProvider({children}: PropsWithChildren<{}>) {
    const hasMounted = useRef(false);
    const {themeSetting} = useThemeSetting();
    const {colorScheme, isDarkColorScheme, setColorScheme} = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

    useEffect(() => {
        setColorScheme(themeSetting)
    }, [themeSetting]);

    useEffect(() => {
        setAndroidNavigationBar(colorScheme)
    }, [colorScheme]);

    useIsomorphicLayoutEffect(() => {
        if (hasMounted.current) {
            return;
        }

        if (Platform.OS === 'web') {
            // Adds the background color to the html element to prevent white background on overscroll.
            document.documentElement.classList.add('bg-background');
        }
        setAndroidNavigationBar(colorScheme);
        setIsColorSchemeLoaded(true);
        hasMounted.current = true;
    }, []);

    if (!isColorSchemeLoaded) {
        return null;
    }

    return <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        {children}
    </ThemeProvider>
}

const useIsomorphicLayoutEffect =
    Platform.OS === 'web' && typeof window === 'undefined' ? useEffect : useLayoutEffect;
