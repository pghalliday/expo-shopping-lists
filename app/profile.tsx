import * as React from 'react';
import {View} from 'react-native';
import {useFirstRun} from "~/lib/Root/FirstRunProvider";
import {Redirect} from "expo-router";
import {Drawer} from "expo-router/drawer";
import {useCurrentProfile} from "~/lib/Root/CurrentProfileProvider";
import {ProfileView} from "~/components/ProfileView";

export default function Screen() {
    const {firstRun} = useFirstRun();
    if (firstRun) return <Redirect href='/firstRun'/>
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
