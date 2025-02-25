import * as React from "react";
import {Pressable, View} from "react-native";
import {Text} from "~/components/ui/text";
import {withObservables} from "@nozbe/watermelondb/react";
import {Link} from "expo-router";
import Item from "~/model/Item";

type ItemListItemProps = {
    item: Item,
};

function ItemListItem ({item}: ItemListItemProps) {
    return (
        <View className='p-3 mb-1 bg-background'>
            <Link
                href={{
                   pathname: '/list/[id]',
                   params: {
                       id: item.id,
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
    ['item'],
    ({ item }: {item: Item}) => ({
        item,
    })
);

export default enhance(ItemListItem);
