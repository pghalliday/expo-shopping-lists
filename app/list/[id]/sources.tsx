import {View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import List from "~/model/List";
import {database} from "~/model/database";
import SourceList from "~/components/sources/SourceList";
import {PlusButton} from "~/components/PlusButton";
import {Text} from "~/components/ui/text";
import assert from "assert";

export default function Screen() {
    const { id }: { id: string } = useLocalSearchParams();
    const [list, setList] = useState<List>();

    async function addSource() {
        assert(list !== undefined);
        await list.addSource('test source');
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
                <SourceList sources={list.sources} />
                <PlusButton onPress={addSource}></PlusButton>
            </View>
        );
    }

    return (
        <View className='flex-1 bg-secondary'>
            <Text>Loading...</Text>
        </View>
    );
}
