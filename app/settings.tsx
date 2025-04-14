import * as React from 'react';
import {View} from 'react-native';
import {Stack} from "expo-router";
import {ThemeSelect} from "~/components/ThemeSelect";
import {Separator} from "~/components/ui/separator";
import {Auth} from "~/components/Auth";

export default function Screen() {
    return (
        <>
            <Stack.Screen options={{ title: "Settings" }} />
            <View className='flex-1 p-6 gap-4'>
                <Auth/>
                <Separator/>
                <ThemeSelect/>
            </View>
        </>
    );
}
