import {StatusBar} from "expo-status-bar";
import {useColorScheme} from "~/lib/useColorScheme";
import * as React from "react";

export function ThemedStatusBar() {
    const {isDarkColorScheme} = useColorScheme();
    return <StatusBar style={isDarkColorScheme ? 'light' : 'dark'}/>
}
