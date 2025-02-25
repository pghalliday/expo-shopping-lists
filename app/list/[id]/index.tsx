import {View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import List from "~/model/List";
import {database} from "~/model/database";
import {PlusButton} from "~/components/PlusButton";
import * as React from "react";
import CurrentItemList from "~/components/currentItems/CurrentItemList";
import {Text} from "~/components/ui/text";

export default function Screen() {
    const { id }: { id: string } = useLocalSearchParams();
    const [list, setList] = useState<List>();

    async function addCurrentItem() {
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
                <CurrentItemList currentItems={list.currentItems} />
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
