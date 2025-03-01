import * as React from "react";
import {Pressable, View} from "react-native";
import {Text} from "~/components/ui/text";
import {withObservables} from "@nozbe/watermelondb/react";
import {Link} from "expo-router";
import Item from "~/model/Item";
import {database} from "~/model/database";
import {DeleteButton} from "~/components/DeleteButton";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";

type ItemListItemProps = {
    item: Item,
};

function ItemListItem ({item}: ItemListItemProps) {
    async function deleteItem() {
        return database.write(async () => {
            await item.markAsDeleted();
        });
    }

    const renderActions = () => (
        <View className='p-3 mb-1 bg-red-600'>
            <DeleteButton onPress={deleteItem} />
        </View>
    );

    return (
        <ReanimatedSwipeable renderRightActions={renderActions}>
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
        </ReanimatedSwipeable>
    );
}

const enhance = withObservables(
    ['item'],
    ({ item }: {item: Item}) => ({
        item,
    })
);

export default enhance(ItemListItem);
