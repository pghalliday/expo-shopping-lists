import {View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import List from "~/model/List";
import {database} from "~/model/database";
import ItemList from "~/components/items/ItemList";
import {PlusButton} from "~/components/PlusButton";
import {Text} from "~/components/ui/text";
import assert from "assert";

export default function Screen() {
    const { id }: { id: string } = useLocalSearchParams();
    const [list, setList] = useState<List>();

    async function addItem() {
        assert(list !== undefined);
        await list.addItem('test item', 'kg');
    }

    useEffect(() => {
        const findList = async () => {
            const list = await database.get<List>('lists').find(id)
            setList(list);
            console.log(list.name)
        }
        findList().catch(console.error)
    })

    if (list !== undefined) {
        return (
            <View className='flex-1 bg-secondary'>
                <ItemList items={list.items} />
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
