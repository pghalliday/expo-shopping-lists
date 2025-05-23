import {FirstRunProvider} from "~/lib/AppProviders/FirstRunProvider";
import {ThemeSettingProvider} from "~/lib/AppProviders/ThemeSettingProvider";
import {SupabaseSessionProvider} from "~/lib/AppProviders/SupabaseSessionProvider";
import {PropsWithChildren} from "react";

export function AppProviders({children}: PropsWithChildren<{}>) {
    return <FirstRunProvider>
        <ThemeSettingProvider>
            <SupabaseSessionProvider>
                {children}
            </SupabaseSessionProvider>
        </ThemeSettingProvider>
    </FirstRunProvider>;
}