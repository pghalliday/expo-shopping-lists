import '~/global.css';

import {Stack} from 'expo-router';
import * as React from 'react';
import {useEffect} from 'react';
import {PortalHost} from '@rn-primitives/portal';
import {SettingsButton} from "~/components/SettingsButton";
import {useFirstRun} from "~/lib/Root/FirstRunProvider";
import {Root} from "~/lib/Root";
import {ThemedStatusBar} from "~/components/ThemedStatusBar";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
    const {firstRun, setFirstRun} = useFirstRun();

    useEffect(() => {
        console.log('firstRun: ' + firstRun)
    }, [firstRun]);

    return (
        <Root>
            <ThemedStatusBar/>
            <Stack
                screenOptions={{
                    headerRight: () => <SettingsButton/>
                }}
            >
                <Stack.Screen
                    name='index'
                    options={{
                        title: 'Shopping Lists',
                    }}
                />
                <Stack.Screen
                    name='list/[id]'
                    options={{}}
                />
            </Stack>
            <PortalHost/>
        </Root>
    );
}
