import * as React from 'react';
import {useFirstRun} from "~/lib/Root/FirstRunProvider";
import {FirstRun} from "~/components/FirstRun";
import {CurrentList} from "~/components/CurrentList";

export default function Screen() {
    const {firstRun} = useFirstRun();
    if (firstRun) return <FirstRun/>
    return <CurrentList/>
}
