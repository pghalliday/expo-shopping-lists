import * as React from 'react';
import {useIsInitialized} from "~/lib/providers/IsInitialisedProvider";
import {CurrentList} from "~/components/CurrentList";
import {Redirect} from "expo-router";

export default function Screen() {
    const {isInitialized} = useIsInitialized();
    if (!isInitialized) return <Redirect href='/firstRun'/>
    return <CurrentList/>
}
