import "reflect-metadata";
import '~/global.css';

import * as React from 'react';
import {Providers} from "~/lib/providers";
import {Drawer} from "expo-router/drawer";
import {DrawerButton} from "~/components/DrawerButton";
import {useIsInitialized} from "~/lib/providers/IsInitialisedProvider";
import {Stack} from "expo-router";
import {useCurrentProfile} from "~/lib/providers/CurrentProfileProvider";
import {configure} from "~/tsyringe/configure";
import {RealtimeService} from "~/lib/services/RealtimeService";
import {container} from "tsyringe";

// Configure the tsyringe container
configure();

// Start the realtime service to sync on remote events
container.resolve(RealtimeService);

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
    const InnerLayout = () => {
        const {isInitialized} = useIsInitialized();
        const currentProfile = useCurrentProfile();

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
                    options={currentProfile ? {
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

        if (isInitialized) return <DefaultLayout/>
        return <FirstRunLayout/>
    }

    return (
        <Providers>
            <InnerLayout/>
        </Providers>
    );
}
