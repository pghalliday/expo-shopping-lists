import * as React from "react";
import {Stack} from "expo-router";
import {SettingsButton} from "~/components/SettingsButton";

export function WithoutCurrentList() {
    return <>
        <Stack.Screen
            options={{
                title: 'No List',
                headerRight: () => <SettingsButton/>,
            }}
        />
    </>
}
