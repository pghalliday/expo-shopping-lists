import * as React from "react";
import {Drawer} from "expo-router/drawer";

export function WithoutCurrentList() {
    return <>
        <Drawer.Screen
            options={{
                title: 'No List',
                headerRight: () => null,
            }}
        />
    </>
}
