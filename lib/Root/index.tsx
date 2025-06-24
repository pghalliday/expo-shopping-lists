import {FirstRunProvider} from "~/lib/Root/FirstRunProvider";
import {ThemeSettingProvider} from "~/lib/Root/ThemeSettingProvider";
import {SupabaseSessionProvider} from "~/lib/Root/SupabaseSessionProvider";
import * as React from "react";
import {PropsWithChildren} from "react";
import {KeyboardAvoidingView, KeyboardProvider} from "react-native-keyboard-controller";
import {AppThemeProvider} from "~/lib/Root/AppThemeProvider";
import {CurrentListProvider} from "~/lib/Root/CurrentListProvider";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {PortalHost} from "@rn-primitives/portal";
import {ThemedStatusBar} from "~/components/ThemedStatusBar";
import {CurrentProfileProvider} from "~/lib/Root/CurrentProfileProvider";
import {SyncProvider} from "~/lib/Root/SyncProvider";

export function Root({children}: PropsWithChildren<{}>) {
    return <FirstRunProvider>
        <ThemeSettingProvider>
            <AppThemeProvider>
                <SupabaseSessionProvider>
                    <SyncProvider throttleDuration={5000} retryDelay={2000}>
                        <CurrentProfileProvider>
                            <CurrentListProvider>
                                <KeyboardProvider>
                                    <KeyboardAvoidingView
                                        behavior={"padding"}
                                        keyboardVerticalOffset={0}
                                        className='flex-1'
                                    >
                                        {/*This must be outside the PortalHost, otherwise dialogs do not avoid the keyboard*/}
                                        <GestureHandlerRootView className='flex-1'>
                                            <ThemedStatusBar/>
                                            {children}
                                            <PortalHost/>
                                        </GestureHandlerRootView>
                                    </KeyboardAvoidingView>
                                </KeyboardProvider>
                            </CurrentListProvider>
                        </CurrentProfileProvider>
                    </SyncProvider>
                </SupabaseSessionProvider>
            </AppThemeProvider>
        </ThemeSettingProvider>
    </FirstRunProvider>;
}