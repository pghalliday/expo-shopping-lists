import * as React from 'react';
import {useFirstRun} from "~/lib/Root/FirstRunProvider";
import {CurrentList} from "~/components/CurrentList";
import {Redirect} from "expo-router";

export default function Screen() {
    const {firstRun} = useFirstRun();
    if (firstRun) return <Redirect href='/firstRun'/>
    return <CurrentList/>
}
