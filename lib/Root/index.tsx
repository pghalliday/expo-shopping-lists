import {FirstRunProvider} from "~/lib/Root/FirstRunProvider";
import {ThemeSettingProvider} from "~/lib/Root/ThemeSettingProvider";
import {SupabaseSessionProvider} from "~/lib/Root/SupabaseSessionProvider";
import {PropsWithChildren} from "react";
import {KeyboardAvoidingView, KeyboardProvider} from "react-native-keyboard-controller";
import {AppThemeProvider} from "~/lib/Root/AppThemeProvider";

export function Root({children}: PropsWithChildren<{}>) {
    return <FirstRunProvider>
        <ThemeSettingProvider>
            <AppThemeProvider>
                <SupabaseSessionProvider>
                    <KeyboardProvider>
                        <KeyboardAvoidingView
                            behavior={"padding"}
                            keyboardVerticalOffset={0}
                            className='flex-1'
                        >
                            {children}
                        </KeyboardAvoidingView>
                    </KeyboardProvider>
                </SupabaseSessionProvider>
            </AppThemeProvider>
        </ThemeSettingProvider>
    </FirstRunProvider>;
}