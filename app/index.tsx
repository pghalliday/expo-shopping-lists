import * as React from 'react';
import {ShoppingLists} from "~/components/ShoppingLists";
import {useFirstRun} from "~/lib/Root/FirstRunProvider";
import {FirstRun} from "~/components/FirstRun";

export default function Screen() {
    const {firstRun} = useFirstRun();
    if (firstRun) return <FirstRun/>
    return <ShoppingLists/>
}
