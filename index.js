import {registerRootComponent} from 'expo';
import {ExpoRoot} from 'expo-router';
import {AppProviders} from "./lib/AppProviders";
import {KeyboardAvoidingView} from "react-native-keyboard-controller";

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined

// Must be exported or Fast Refresh won't update the context
export function App() {
    const ctx = require.context('./app');
    return <AppProviders>
        <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={0}
            className='flex-1'
        >
            <ExpoRoot context={ctx}/>
        </KeyboardAvoidingView>
    </AppProviders>;
}

registerRootComponent(App);
