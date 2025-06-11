import * as React from 'react';
import {View} from 'react-native';
import {addList, database, lists} from "~/model/database";
import {PlusButton} from "~/components/PlusButton";
import List from "~/model/List";
import {router, Stack} from "expo-router";
import {createModelList} from "~/components/ModelList";
import {SettingsButton} from "~/components/SettingsButton";

type ListListItemProps = {
    list: List,
};

const ListList = createModelList({
    async delete(props: ListListItemProps): Promise<void> {
        await database.write(async () => {
            await props.list.markAsDeleted();
        });
    },
    getListText(props: ListListItemProps): string {
        return props.list.name;
    },
    onPress(props: ListListItemProps): void {
        router.push(`/list/${props.list.id}`)
    },
    getObservables({model}: { model: List }): any {
        return {
            list: model,
        }
    }
})

export function ShoppingLists() {
    return <>
        <Stack.Screen
            options={{
                title: 'Shopping Lists',
                headerRight: () => <SettingsButton/>,
            }}
        />
        <View className='flex-1 bg-secondary'>
            <ListList models={lists}/>
            <PlusButton onPress={() => addList('New list')}></PlusButton>
        </View>
    </>
}
