import * as React from "react";
import {Pressable, View} from "react-native";
import {Text} from "~/components/ui/text";
import {withObservables} from "@nozbe/watermelondb/react";
import {Link} from "expo-router";
import Source from "~/model/Source";

type SourceListItemProps = {
    source: Source,
};

function SourceListItem ({source}: SourceListItemProps) {
    return (
        <View className='p-3 mb-1 bg-background'>
            <Link
                href={{
                   pathname: '/list/[id]',
                   params: {
                       id: source.id,
                   },
                }}
                asChild
            >
                <Pressable>
                    <Text className='text-base font-semibold'>{source.name}</Text>
                </Pressable>
            </Link>
        </View>
    );
}

const enhance = withObservables(
    ['source'],
    ({ source }: {source: Source}) => ({
        source,
    })
);

export default enhance(SourceListItem);
