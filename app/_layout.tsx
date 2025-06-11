import '~/global.css';

import * as React from 'react';
import {PortalHost} from '@rn-primitives/portal';
import {Root} from "~/lib/Root";
import {ThemedStatusBar} from "~/components/ThemedStatusBar";
import {Stack} from "expo-router";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
    return (
        <Root>
            <ThemedStatusBar/>
            <Stack/>
            <PortalHost/>
        </Root>
    );
}
