import * as React from 'react';
import {View} from 'react-native';
import {Text} from "~/components/ui/text";
import {Link, Stack} from "expo-router";
import {Button} from "~/components/ui/button";
import {useFirstRun} from "~/lib/Root/FirstRunProvider";
import {useSupabaseSession} from "~/lib/Root/SupabaseSessionProvider";
import {useEffect} from "react";
import {addList} from "~/model/database";
import {useCurrentList} from "~/lib/Root/CurrentListProvider";

export function FirstRun() {
    const {setFirstRun} = useFirstRun();
    const {setCurrentList} = useCurrentList();
    const session = useSupabaseSession();

    const createLocal = async () => {
        const list = await addList('My first list');
        await setCurrentList(list.id);
        await setFirstRun(false);
    }

    useEffect(() => {
        if (session !== null) setFirstRun(false);
    }, [session]);

    return <>
        <Stack.Screen
            options={{
                title: 'First Run',
                // This is needed to remove the settings button added by the ShoppingLists component
                // as FirstRun and ShoppingLists share the same Screen in the Stack
                headerRight: () => null,
            }}
        />
        <View className='flex-1 bg-background p-6 gap-12'>
            <Text>Do you wish to link to an online account or start with a local database?</Text>
            <View className='gap-y-4'>
                <Link
                    href='/login'
                    asChild
                >
                    <Button>
                        <Text>Link</Text>
                    </Button>
                </Link>
                <Button onPress={createLocal}>
                    <Text>Local</Text>
                </Button>
            </View>
        </View>
    </>
}
