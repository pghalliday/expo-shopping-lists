import * as React from 'react';
import {useIsInitialized} from "~/lib/providers/IsInitialisedProvider";
import {Redirect, Stack} from "expo-router";
import {useCurrentList} from "~/lib/providers/CurrentListProvider";
import {View} from "react-native";
import {Text} from "~/components/ui/text";
import {Button} from "~/components/ui/button";
import {LoginButton} from "~/components/LoginButton";
import {useApi} from "~/lib/providers/ApiProvider";

export default function Screen() {
    const {isInitialized, setIsInitialized} = useIsInitialized();
    if (isInitialized) return <Redirect href='/'/>

    const api = useApi();
    const {setCurrentList} = useCurrentList();

    const createLocal = async () => {
        // TODO: error handling
        const list = await api.addList('My first list');
        await setCurrentList(list.id);
        await setIsInitialized(true);
    }

    const onLinkComplete = async () => {
        await setCurrentList(undefined);
        await setIsInitialized(true);
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
