import * as React from 'react';
import {useFirstRun} from "~/lib/Root/FirstRunProvider";
import {Redirect, Stack} from "expo-router";
import {useCurrentList} from "~/lib/Root/CurrentListProvider";
import {addList} from "~/model/database";
import {View} from "react-native";
import {Text} from "~/components/ui/text";
import {Button} from "~/components/ui/button";
import {LoginButton} from "~/components/LoginButton";

export default function Screen() {
    const {firstRun, setFirstRun} = useFirstRun();
    if (!firstRun) return <Redirect href='/'/>

    const {setCurrentList} = useCurrentList();

    const createLocal = async () => {
        // TODO: error handling
        const list = await addList('My first list');
        await setCurrentList(list.id);
        await setFirstRun(false);
    }

    const onLinkComplete = async () => {
        await setCurrentList(null);
        await setFirstRun(false);
    }

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
                <LoginButton label='Link' onComplete={onLinkComplete}/>
                <Button onPress={createLocal}>
                    <Text>Local</Text>
                </Button>
            </View>
        </View>
    </>
}
