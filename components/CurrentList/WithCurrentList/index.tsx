import * as React from "react";
import {useEffect, useState} from "react";
import {ActivityIndicator, View} from "react-native";
import List from "~/model/List";
import {database} from "~/model/database";
import CurrentItem from "~/model/CurrentItem";
import {EditButton} from "~/components/EditButton";
import {Drawer} from "expo-router/drawer";
import {PlusButton} from "~/components/PlusButton";
import Item from "~/model/Item";
import {createModelList} from "~/components/ModelList";
import {AddItemDialog} from "~/components/CurrentList/WithCurrentList/AddItemDialog";
import {EditListDialog} from "~/components/CurrentList/WithCurrentList/EditListDialog";

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

type WithCurrentListProps = {
    currentList: string,
};

export function WithCurrentList({currentList}: WithCurrentListProps) {
    const [list, setList] = useState<List>();
    const [addingItem, setAddingItem] = useState(false);
    const [editingList, setEditingList] = useState(false);

    useEffect(() => {
        const findList = async () => {
            const list = await database.get<List>('lists').find(currentList)
            setList(list);
        }
        findList().catch(console.error)
    })

    const onStartEdit = () => {
        setEditingList(true);
    }

    const onCompleteEdit = () => {
        setEditingList(false);
    }

    const onStartAdd = () => {
        setAddingItem(true);
    }

    const onCompleteAdd = (currentItem?: CurrentItem) => {
        if (currentItem !== undefined) {
            console.log(`Added item with id: ${currentItem.id}`);
        } else {
            console.log('Cancelled add item');
        }
        setAddingItem(false);
    }

    if (list !== undefined) {
        return <>
            <Drawer.Screen
                options={{
                    title: list.name,
                    headerRight: () => <EditButton onPress={onStartEdit}/>,
                }}
            />
            <View className='flex-1 bg-secondary py-1'>
                <CurrentItemList models={list!.currentItems}/>
                <AddItemDialog open={addingItem} list={list} onCompleteAdd={onCompleteAdd}/>
                <EditListDialog open={editingList} list={list} onCompleteEdit={onCompleteEdit}/>
                <PlusButton onPress={onStartAdd}/>
            </View>
        </>
    }

    return <>
        <Drawer.Screen
            options={{
                drawerLabel: 'Home',
                title: 'Loading...',
                headerRight: () => null,
            }}
        />
        <View className='flex-1 bg-secondary'>
            <ActivityIndicator animating/>
        </View>
    </>
}
