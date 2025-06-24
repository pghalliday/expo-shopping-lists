import * as React from 'react';
import {View} from 'react-native';
import {ThemeSelect} from "~/components/ThemeSelect";
import {Separator} from "~/components/ui/separator";
import {LinkedAccount} from "~/components/LinkedAccount";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {useIsInitialized} from "~/lib/providers/IsInitialisedProvider";
import {Redirect} from "expo-router";
import {Drawer} from "expo-router/drawer";
import {useApi} from "~/lib/providers/ApiProvider";
import {useSupabase} from "~/lib/providers/SupabaseProvider";
import {useCallback} from "react";

export default function Screen() {
    const {isInitialized, setIsInitialized} = useIsInitialized();
    const supabase = useSupabase();
    if (!isInitialized) return <Redirect href='/firstRun'/>

    const api = useApi();

    const reset = useCallback(async () => {
        if (supabase && api) {
            await supabase.auth.signOut();
            await api.resetDatabase();
            await setIsInitialized(false);
        }
    }, [supabase, api])

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
