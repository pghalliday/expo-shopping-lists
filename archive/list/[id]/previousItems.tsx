import {View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import List from "~/model/List";
import {PlusButton} from "~/components/PlusButton";
import {Text} from "~/components/ui/text";
import PreviousItem from "~/model/PreviousItem";
import Item from "~/model/Item";
import {createModelList} from "~/components/ModelList";
import {useDatabase} from "@nozbe/watermelondb/react";

type PreviousItemListItemProps = {
    previousItem: PreviousItem,
    item: Item,
};

export default function Screen() {
    const database = useDatabase();
    const {id}: { id: string } = useLocalSearchParams();
    const [list, setList] = useState<List>();

    async function addPreviousItem() {
    }

    useEffect(() => {
        const findList = async () => {
            const list = await database.get<List>('lists').find(id)
            setList(list);
        }
        findList().catch(console.error)
    })

    const PreviousItemList = createModelList({
        async delete(props: PreviousItemListItemProps): Promise<void> {
            await database.write(async () => {
                await props.previousItem.markAsDeleted();
            });
        },
        getListText(props: PreviousItemListItemProps): string {
            return props.item.name;
        },
        onPress(_props: PreviousItemListItemProps): void {
        },
        getObservables({model}: { model: PreviousItem }): any {
            return {
                previousItem: model,
                item: model.item,
            }
        }
    })

    if (list !== undefined) {
        return (
            <View className='flex-1 bg-secondary'>
                <PreviousItemList models={list.previousItems}/>
                <PlusButton onPress={addPreviousItem}></PlusButton>
            </View>
        );
    }

    return (
        <View className='flex-1 bg-secondary'>
            <Text>Loading...</Text>
        </View>
    );
}
