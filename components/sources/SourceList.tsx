import {FlatList} from "~/components/FlatList";
import * as React from "react";
import {withObservables} from "@nozbe/watermelondb/react";
import SourceListItem from "~/components/sources/SourceListItem";
import Source from "~/model/Source";
import {GestureHandlerRootView} from "react-native-gesture-handler";

type SourceListProps = {
    sources: Source[],
};

function SourceList({sources}: SourceListProps) {
    return (
        <GestureHandlerRootView>
            <FlatList
                data={sources}
                renderItem={({item}) => <SourceListItem source={item} />}
                keyExtractor={source => source.id}
            />
        </GestureHandlerRootView>
    );
}

const enhance = withObservables(
    ['sources'],
    ({ sources }: {sources: Source[]}) => ({
        sources,
    })
);

export default enhance(SourceList);
