import List from "~/model/List";
import * as React from "react";
import {Pressable, View} from "react-native";
import {Text} from "~/components/ui/text";
import {withObservables} from "@nozbe/watermelondb/react";
import {Link} from "expo-router";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import {DeleteButton} from "~/components/DeleteButton";
import {database} from "~/model/database";

type ListListItemProps = {
    list: List,
};

function ListListItem ({list}: ListListItemProps) {
    async function deleteList() {
        return database.write(async () => {
            await list.markAsDeleted();
        });
    }

    const renderActions = () => (
        <View className='p-3 mb-1 bg-red-600'>
            <DeleteButton onPress={deleteList} />
        </View>
    );

    return (
        <ReanimatedSwipeable renderRightActions={renderActions}>
            <View className='p-3 mb-1 bg-background'>
                <Link
                    href={{
                        pathname: '/list/[id]',
                        params: {
                            id: list.id,
                        },
                    }}
                    asChild
                >
                    <Pressable>
                        <Text className='text-base font-semibold'>{list.name}</Text>
                    </Pressable>
                </Link>
            </View>
        </ReanimatedSwipeable>
    );
}

const enhance = withObservables(
    ['list'],
    ({ list }: {list: List}) => ({
        list,
    })
);

export default enhance(ListListItem);
