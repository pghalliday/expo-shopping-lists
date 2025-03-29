import * as React from 'react';
import {View} from 'react-native';
import {ThemeSwitch} from "~/components/ThemeSwitch";

export default function Screen() {
    return (
        <>
            <View className='flex-1 bg-background justify-center items-center p-6 gap-12'>
                <View className='flex-row items-center gap-2'>
                    <ThemeSwitch/>
                </View>
            </View>
        </>
    );
}
