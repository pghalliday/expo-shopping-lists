import * as React from 'react';
import {View} from 'react-native';
import {Stack} from "expo-router";
import {ThemeSelect} from "~/components/ThemeSelect";

export default function Screen() {
    return (
        <>
            <Stack.Screen options={{ title: "Settings" }} />
            <View className='flex-1 bg-background justify-center items-center p-6 gap-12'>
                <View className='flex-row items-center gap-2'>
                    <ThemeSelect/>
                </View>
            </View>
        </>
    );
}
