import {View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import List from "~/model/List";
import {PlusButton} from "~/components/PlusButton";
import {Text} from "~/components/ui/text";
import assert from "assert";
import Source from "~/model/Source";
import {createModelList} from "~/components/ModelList";
import {useDatabase} from "@nozbe/watermelondb/react";

type SourceListItemProps = {
    source: Source,
};

export default function Screen() {
    const database = useDatabase();
    const {id}: { id: string } = useLocalSearchParams();
    const [list, setList] = useState<List>();

    async function addSource() {
        assert(list !== undefined);
        await list.addSource('test source');
    }

    useEffect(() => {
        const findList = async () => {
            const list = await database.get<List>('lists').find(id)
            setList(list);
        }
        findList().catch(console.error)
    })

    const SourceList = createModelList({
        async delete(props: SourceListItemProps): Promise<void> {
            await database.write(async () => {
                await props.source.markAsDeleted();
            });
        },
        getListText(props: SourceListItemProps): string {
            return props.source.name;
        },
        onPress(_props: SourceListItemProps): void {
        },
        getObservables({model}: { model: Source }): any {
            return {
                source: model,
            }
        }
    })

    if (list !== undefined) {
        return (
            <View className='flex-1 bg-secondary'>
                <SourceList models={list.sources}/>
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
