import * as React from 'react';
import {View} from 'react-native';
import {ThemeSelect} from "~/components/ThemeSelect";
import {Separator} from "~/components/ui/separator";
import {Auth} from "~/components/Auth";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {useFirstRun} from "~/lib/Root/FirstRunProvider";
import {Stack, useRouter} from "expo-router";
import {signOutSupabase} from "~/lib/supabase";
import {database, resetDatabase} from "~/model/database";

export default function Screen() {
    const {setFirstRun} = useFirstRun();
    const router = useRouter();

    const reset = async () => {
        await signOutSupabase();
        await resetDatabase();
        await setFirstRun(true);
        router.dismissAll();
    }

    return <>
        <Stack.Screen
            options={{
                title: 'Settings',
            }}
        />
        <View className='flex-1 p-6 gap-4'>
            <Auth/>
            <Separator/>
            <ThemeSelect/>
            <Separator/>
            <Button onPress={reset}>
                <Text>Reset</Text>
            </Button>
        </View>
    </>
}
