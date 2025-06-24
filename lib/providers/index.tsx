import {IsInitializedProvider} from "~/lib/providers/IsInitialisedProvider";
import {ThemeSettingProvider} from "~/lib/providers/ThemeSettingProvider";
import {SessionProvider} from "~/lib/providers/SessionProvider";
import * as React from "react";
import {PropsWithChildren} from "react";
import {KeyboardAvoidingView, KeyboardProvider} from "react-native-keyboard-controller";
import {AppThemeProvider} from "~/lib/providers/AppThemeProvider";
import {CurrentListProvider} from "~/lib/providers/CurrentListProvider";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {PortalHost} from "@rn-primitives/portal";
import {ThemedStatusBar} from "~/components/ThemedStatusBar";
import {CurrentProfileProvider} from "~/lib/providers/CurrentProfileProvider";
import {database} from "~/model/database";
import {ApiProvider} from "~/lib/providers/ApiProvider";
import {
    CurrentListLocalStorage,
    IsInitializedLocalStorage,
    ThemeSettingLocalStorage
} from "~/lib/services/LocalStorageService";
import {Api} from "~/lib/services/Api";
import {container} from "tsyringe";
import {SessionService} from "~/lib/services/SessionService";
import {SupabaseProvider} from "~/lib/providers/SupabaseProvider";
import {supabase} from "~/supabase/ts/supabase";

export function Providers({children}: PropsWithChildren<{}>) {
    const isInitializedStorage = container.resolve(IsInitializedLocalStorage);
    const themeSettingStorage = container.resolve(ThemeSettingLocalStorage);
    const currentListStorage = container.resolve(CurrentListLocalStorage);
    const api = container.resolve(Api);
    const sessionService = container.resolve(SessionService);

    return <IsInitializedProvider storage={isInitializedStorage}>
        <ThemeSettingProvider storage={themeSettingStorage}>
            <AppThemeProvider>
                <SupabaseProvider supabase={supabase}>
                    <SessionProvider service={sessionService}>
                        <ApiProvider api={api}>
                            <CurrentProfileProvider database={database}>
                                <CurrentListProvider
                                    storage={currentListStorage}>
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
                        </ApiProvider>
                    </SessionProvider>
                </SupabaseProvider>
            </AppThemeProvider>
        </ThemeSettingProvider>
    </IsInitializedProvider>
}