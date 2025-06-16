import * as React from 'react';
import {View} from 'react-native';
import {ThemeSelect} from "~/components/ThemeSelect";
import {Separator} from "~/components/ui/separator";
import {LinkedAccount} from "~/components/LinkedAccount";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {useFirstRun} from "~/lib/Root/FirstRunProvider";
import {Redirect, useRouter} from "expo-router";
import {signOutSupabase} from "~/lib/supabase";
import {resetDatabase} from "~/model/database";
import {PortalHost} from "@rn-primitives/portal";
import {Drawer} from "expo-router/drawer";

export default function Screen() {
    const {firstRun, setFirstRun} = useFirstRun();
    if (firstRun) return <Redirect href='/firstRun'/>

    const reset = async () => {
        await signOutSupabase();
        await resetDatabase();
        await setFirstRun(true);
    }

    return <>
        <Drawer.Screen
            options={{
                title: 'Settings',
                headerRight: () => null,
            }}
        />
        <View className='flex-1 p-6 gap-4'>
            <LinkedAccount/>
            <Separator/>
            <ThemeSelect/>
            <Separator/>
            <Button onPress={reset}>
                <Text>Reset</Text>
            </Button>
        </View>
    </>
}
