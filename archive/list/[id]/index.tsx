import {View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import * as React from "react";
import {useEffect, useState} from "react";
import List from "~/model/List";
import {PlusButton} from "~/components/PlusButton";
import {Text} from "~/components/ui/text";
import CurrentItem from "~/model/CurrentItem";
import Item from "~/model/Item";
import {createModelList} from "~/components/ModelList";
import {useDatabase} from "@nozbe/watermelondb/react";

type CurrentItemListItemProps = {
    currentItem: CurrentItem,
    item: Item,
};

export default function Screen() {
    const database = useDatabase();
    const {id}: { id: string } = useLocalSearchParams();
    const [list, setList] = useState<List>();

    async function addCurrentItem() {
    }

    useEffect(() => {
        const findList = async () => {
            const list = await database.get<List>('lists').find(id)
            setList(list);
        }
        findList().catch(console.error)
    })

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

    if (list !== undefined) {
        return (
            <View className='flex-1 bg-secondary'>
                <CurrentItemList models={list.currentItems}/>
                <PlusButton onPress={addCurrentItem}></PlusButton>
            </View>
        );
    }

    return (
        <View className='flex-1 bg-secondary'>
            <Text>Loading...</Text>
        </View>
    );
}
