import * as React from "react";
import {Pressable, View} from "react-native";
import {Text} from "~/components/ui/text";
import {withObservables} from "@nozbe/watermelondb/react";
import {Link} from "expo-router";
import CurrentItem from "~/model/CurrentItem";
import Item from "~/model/Item";

type CurrentItemListItemProps = {
    currentItem: CurrentItem,
    item: Item,
};

function CurrentItemListItem ({currentItem, item}: CurrentItemListItemProps) {
    return (
        <View className='p-3 mb-1 bg-background'>
            <Link
                href={{
                   pathname: '/list/[id]',
                   params: {
                       id: currentItem.id,
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
    ['currentItem'],
    ({ currentItem }: {currentItem: CurrentItem}) => ({
        currentItem,
        item: currentItem.item,
    })
);

export default enhance(CurrentItemListItem);
