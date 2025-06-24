import * as React from 'react';
import {View} from 'react-native';
import {useIsInitialized} from "~/lib/providers/IsInitialisedProvider";
import {Redirect} from "expo-router";
import {Drawer} from "expo-router/drawer";
import {useCurrentProfile} from "~/lib/providers/CurrentProfileProvider";
import {ProfileView} from "~/components/ProfileView";

export default function Screen() {
    const {isInitialized} = useIsInitialized();
    if (!isInitialized) return <Redirect href='/firstRun'/>
    const currentProfile = useCurrentProfile();

    if (!currentProfile) return <Redirect href='/'/>

    return <>
        <Drawer.Screen
            options={{
                title: 'Profile',
                headerRight: () => null,
            }}
        />
        <View className='flex-1 p-6 gap-4'>
            <ProfileView profile={currentProfile}/>
        </View>
    </>
}
