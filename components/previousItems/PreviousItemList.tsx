import {FlatList} from "~/components/FlatList";
import * as React from "react";
import {withObservables} from "@nozbe/watermelondb/react";
import PreviousItem from "~/model/PreviousItem";
import PreviousItemListItem from "~/components/previousItems/PreviousItemListItem";

type PreviousItemListProps = {
    previousItems: PreviousItem[],
};

function PreviousItemList({previousItems}: PreviousItemListProps) {
    return (
        <FlatList
                  data={previousItems}
                  renderItem={({item}) => <PreviousItemListItem previousItem={item} />}
                  keyExtractor={previousItem => previousItem.id}
        />
    );
}

const enhance = withObservables(
    ['previousItems'],
    ({ previousItems }: {previousItems: PreviousItem[]}) => ({
        previousItems,
    })
);

export default enhance(PreviousItemList);
