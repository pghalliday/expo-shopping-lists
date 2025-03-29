import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { useColorScheme } from '~/lib/useColorScheme';
import {Switch} from "~/components/ui/switch";
import {Label} from "~/components/ui/label";
import * as React from "react";

export function ThemeSwitch() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  }

  return (
      <>
        <Switch checked={isDarkColorScheme} onCheckedChange={toggleColorScheme} nativeID='dark-mode'/>
        <Label
            nativeID='dark-mode'
            onPress={toggleColorScheme}
        >
          Dark mode
        </Label>
      </>
  );
}
