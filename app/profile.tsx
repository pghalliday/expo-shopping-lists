import * as React from 'react';
import {View} from 'react-native';
import {ThemeSelect} from "~/components/ThemeSelect";
import {Separator} from "~/components/ui/separator";
import {LinkedAccount} from "~/components/LinkedAccount";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {useFirstRun} from "~/lib/Root/FirstRunProvider";
import {Redirect} from "expo-router";
import {signOutSupabase} from "~/lib/supabase";
import {resetDatabase} from "~/model/database";
import {Drawer} from "expo-router/drawer";
import {useSupabaseSession} from "~/lib/Root/SupabaseSessionProvider";

export default function Screen() {
    const {firstRun, setFirstRun} = useFirstRun();
    if (firstRun) return <Redirect href='/firstRun'/>
    const session = useSupabaseSession();
    if (!session) return <Redirect href='/'/>

    const reset = async () => {
        await signOutSupabase();
        await resetDatabase();
        await setFirstRun(true);
    }

    return <>
        <Drawer.Screen
            options={{
                title: 'Profile',
                headerRight: () => null,
            }}
        />
        <View className='flex-1 p-6 gap-4'>
            <Separator/>
        </View>
    </>
}
