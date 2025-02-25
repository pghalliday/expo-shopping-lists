import List from "~/model/List";
import * as React from "react";
import {Pressable, View} from "react-native";
import {Text} from "~/components/ui/text";
import {withObservables} from "@nozbe/watermelondb/react";
import {Link} from "expo-router";

type ListListItemProps = {
    list: List,
};

function ListListItem ({list}: ListListItemProps) {
    return (
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
    );
}

const enhance = withObservables(
    ['list'],
    ({ list }: {list: List}) => ({
        list,
    })
);

export default enhance(ListListItem);
