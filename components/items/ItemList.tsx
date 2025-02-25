import {FlatList} from "~/components/FlatList";
import * as React from "react";
import {withObservables} from "@nozbe/watermelondb/react";
import Item from "~/model/Item";
import ItemListItem from "~/components/items/ItemListItem";

type ItemListProps = {
    items: Item[],
};

function ItemList({items}: ItemListProps) {
    return (
        <FlatList
                  data={items}
                  renderItem={({item}) => <ItemListItem item={item} />}
                  keyExtractor={item => item.id}
        />
    );
}

const enhance = withObservables(
    ['items'],
    ({ items }: {items: Item[]}) => ({
        items,
    })
);

export default enhance(ItemList);
