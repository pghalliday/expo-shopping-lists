import {registerRootComponent} from 'expo';
import {ExpoRoot} from 'expo-router';
import {AppProviders} from "./lib/AppProviders";

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined

// Must be exported or Fast Refresh won't update the context
export function App() {
    const ctx = require.context('./app');
    return <AppProviders>
        <ExpoRoot context={ctx}/>
    </AppProviders>;
}

registerRootComponent(App);
