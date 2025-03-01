import List from "~/model/List";
import {FlatList} from "~/components/FlatList";
import * as React from "react";
import ListListItem from "~/components/lists/ListListItem";
import {withObservables} from "@nozbe/watermelondb/react";
import {GestureHandlerRootView} from "react-native-gesture-handler";

type ListListProps = {
    lists: List[],
};

function ListList({lists}: ListListProps) {
    return (
        <GestureHandlerRootView>
            <FlatList
                data={lists}
                renderItem={({item}) => <ListListItem list={item} />}
                keyExtractor={list => list.id}
            />
        </GestureHandlerRootView>
    );
}

const enhance = withObservables(
    ['lists'],
    ({ lists }: {lists: List[]}) => ({
        lists,
    })
);

export default enhance(ListList);
