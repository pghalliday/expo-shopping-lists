import * as React from "react";
import {View} from "react-native";
import CurrentItem from "~/model/CurrentItem";
import Item from "~/model/Item";
import {createModelList} from "~/components/ModelList";
import {database} from "~/model/database";
import List from "~/model/List";
import {PlusButton} from "~/components/PlusButton";

type CurrentItemListItemProps = {
    currentItem: CurrentItem,
    item: Item,
};

const CurrentItemList = createModelList({
    async delete(props: CurrentItemListItemProps): Promise<void> {
        await database.write(async () => {
            await props.currentItem.markAsDeleted();
        });
    },
    getListText(props: CurrentItemListItemProps): string {
        return props.item.name;
    },
    onPress(_props: CurrentItemListItemProps): void {
    },
    getObservables({model}: { model: CurrentItem }): any {
        return {
            currentItem: model,
            item: model.item,
        }
    }
})

type WhileViewingListProps = {
    list: List,
    onStartAdd: () => void,
};

export function WhileViewingList({list, onStartAdd}: WhileViewingListProps) {
    return <View className='flex-1 bg-secondary'>
        <CurrentItemList models={list!.currentItems} />
        <PlusButton onPress={onStartAdd}></PlusButton>
    </View>
}
