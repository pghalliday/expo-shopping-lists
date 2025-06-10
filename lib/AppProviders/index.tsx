import {FirstRunProvider} from "~/lib/AppProviders/FirstRunProvider";
import {ThemeSettingProvider} from "~/lib/AppProviders/ThemeSettingProvider";
import {SupabaseSessionProvider} from "~/lib/AppProviders/SupabaseSessionProvider";
import {PropsWithChildren} from "react";
import {KeyboardProvider} from "react-native-keyboard-controller";

export function AppProviders({children}: PropsWithChildren<{}>) {
    return <FirstRunProvider>
        <ThemeSettingProvider>
            <SupabaseSessionProvider>
                <KeyboardProvider>
                    {children}
                </KeyboardProvider>
            </SupabaseSessionProvider>
        </ThemeSettingProvider>
    </FirstRunProvider>;
}