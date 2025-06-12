import * as React from "react";
import {useCurrentList} from "~/lib/Root/CurrentListProvider";
import {WithCurrentList} from "~/components/CurrentList/WithCurrentList";
import {WithoutCurrentList} from "~/components/CurrentList/WithoutCurrentList";

export function CurrentList() {
    const {currentList} = useCurrentList();

    if (currentList !== null) return <WithCurrentList currentList={currentList}/>
    return <WithoutCurrentList/>
}
