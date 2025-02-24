import List from "~/model/List";
import {FlatList} from "~/components/FlatList";
import * as React from "react";
import ListListItem from "~/components/ListListItem";
import {withObservables} from "@nozbe/watermelondb/react";

type ListListProps = {
    lists: List[],
};

function ListList({lists}: ListListProps) {
    return (
        <FlatList
                  data={lists}
                  renderItem={({item}) => <ListListItem list={item} />}
                  keyExtractor={list => list.id}
        />
    );
}

const enhance = withObservables(
    ['lists'],
    ({ lists }: {lists: List[]}) => ({
        lists,
    })
);

export default enhance(ListList);
