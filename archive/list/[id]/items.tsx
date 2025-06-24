import {View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import List from "~/model/List";
import {PlusButton} from "~/components/PlusButton";
import {Text} from "~/components/ui/text";
import assert from "assert";
import Item from "~/model/Item";
import {createModelList} from "~/components/ModelList";
import {useDatabase} from "@nozbe/watermelondb/react";

type ItemListItemProps = {
    item: Item,
};

export default function Screen() {
    const database = useDatabase();
    const {id}: { id: string } = useLocalSearchParams();
    const [list, setList] = useState<List>();

    async function addItem() {
        assert(list !== undefined);
        await list.addItem('test item', 'kg');
    }

    useEffect(() => {
        const findList = async () => {
            const list = await database.get<List>('lists').find(id)
            setList(list);
        }
        findList().catch(console.error)
    })

    const ItemList = createModelList({
        async delete(props: ItemListItemProps): Promise<void> {
            await database.write(async () => {
                await props.item.markAsDeleted();
            });
        },
        getListText(props: ItemListItemProps): string {
            return props.item.name;
        },
        onPress(_props: ItemListItemProps): void {
        },
        getObservables({model}: { model: Item }): any {
            return {
                item: model,
            }
        }
    })

    if (list !== undefined) {
        return (
            <View className='flex-1 bg-secondary'>
                <ItemList models={list.items}/>
                <PlusButton onPress={addItem}></PlusButton>
            </View>
        );
    }

    return (
        <View className='flex-1 bg-secondary'>
            <Text>Loading...</Text>
        </View>
    );
}
