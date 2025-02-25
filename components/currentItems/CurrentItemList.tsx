import {FlatList} from "~/components/FlatList";
import * as React from "react";
import {withObservables} from "@nozbe/watermelondb/react";
import CurrentItemListItem from "~/components/currentItems/CurrentItemListItem";
import CurrentItem from "~/model/CurrentItem";

type CurrentItemListProps = {
    currentItems: CurrentItem[],
};

function CurrentItemList({currentItems}: CurrentItemListProps) {
    return (
        <FlatList
                  data={currentItems}
                  renderItem={({item}) => <CurrentItemListItem currentItem={item} />}
                  keyExtractor={currentItem => currentItem.id}
        />
    );
}

const enhance = withObservables(
    ['currentItems'],
    ({ currentItems }: {currentItems: CurrentItem[]}) => ({
        currentItems,
    })
);

export default enhance(CurrentItemList);
