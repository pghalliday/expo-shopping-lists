import List from "~/model/List";
import * as React from "react";
import {View} from "react-native";
import {Text} from "~/components/ui/text";
import {withObservables} from "@nozbe/watermelondb/react";

type ListListItemProps = {
    list: List,
};

function ListListItem ({list}: ListListItemProps) {
    return (
        <View className='p-3 mb-1 bg-white'>
            <Text className='text-base font-semibold'>{list.name}</Text>
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
