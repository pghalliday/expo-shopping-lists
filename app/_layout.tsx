import '~/global.css';

import * as React from 'react';
import {Root} from "~/lib/Root";
import {Drawer} from "expo-router/drawer";
import {DrawerButton} from "~/components/DrawerButton";
import {useFirstRun} from "~/lib/Root/FirstRunProvider";
import {Stack} from "expo-router";
import {useSupabaseSession} from "~/lib/Root/SupabaseSessionProvider";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
    const InnerLayout = () => {
        const {firstRun} = useFirstRun();
        const session = useSupabaseSession();

        const DefaultLayout = () => {
            return <Drawer
                screenOptions={{
                    headerLeft: () => <DrawerButton/>
                }}
            >
                <Drawer.Screen
                    name='index'
                    options={{
                        drawerLabel: 'Home',
                    }}
                />
                <Drawer.Screen
                    name='settings'
                    options={{
                        drawerLabel: 'Settings',
                    }}
                />
                <Drawer.Screen
                    name='profile'
                    options={session ? {
                        drawerLabel: 'Profile',
                    } : {
                        drawerItemStyle: {display: 'none'}
                    }}
                />
                <Drawer.Screen
                    name='firstRun'
                    options={{
                        drawerItemStyle: {display: 'none'}
                    }}
                />
            </Drawer>
        }

        const FirstRunLayout = () => {
            return <Stack/>
        }

        if (firstRun) return <FirstRunLayout/>
        return <DefaultLayout/>
    }

    return (
        <Root>
            <InnerLayout/>
        </Root>
    );
}
