import * as React from "react";
import {Pressable, View} from "react-native";
import {Text} from "~/components/ui/text";
import {withObservables} from "@nozbe/watermelondb/react";
import {Link} from "expo-router";
import PreviousItem from "~/model/PreviousItem";
import Item from "~/model/Item";

type PreviousItemListItemProps = {
    previousItem: PreviousItem,
    item: Item,
};

function PreviousItemListItem ({previousItem, item}: PreviousItemListItemProps) {
    return (
        <View className='p-3 mb-1 bg-background'>
            <Link
                href={{
                   pathname: '/list/[id]',
                   params: {
                       id: previousItem.id,
                   },
                }}
                asChild
            >
                <Pressable>
                    <Text className='text-base font-semibold'>{item.name}</Text>
                </Pressable>
            </Link>
        </View>
    );
}

const enhance = withObservables(
    ['previousItem'],
    ({ previousItem }: {previousItem: PreviousItem}) => ({
        previousItem,
        item: previousItem.item,
    })
);

export default enhance(PreviousItemListItem);
