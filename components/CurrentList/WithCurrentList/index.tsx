import * as React from "react";
import {ActivityIndicator, View} from "react-native";
import {Stack} from "expo-router";
import {useEffect, useState} from "react";
import List from "~/model/List";
import {database} from "~/model/database";
import {WhileAddingItem} from "~/components/CurrentList/WithCurrentList/WhileAddingItem";
import {WhileViewingList} from "~/components/CurrentList/WithCurrentList/WhileViewingList";
import CurrentItem from "~/model/CurrentItem";
import {WhileEditingList} from "~/components/CurrentList/WithCurrentList/WhileEditingList";
import {EditButton} from "~/components/EditButton";
import {CancelButton} from "~/components/CancelButton";

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

    const onCancelEdit = () => {
        setEditingList(false);
    }

    const onStartAdd = () => {
        setAddingItem(true);
    }

    const onCompleteAdd = (currentItem: CurrentItem) => {
        console.log(`Added item with id: ${currentItem.id}`);
        setAddingItem(false);
    }

    const onCancelAdd = () => {
        setAddingItem(false);
    }

    if (list !== undefined) {
        if (addingItem) {
            return <>
                <Stack.Screen
                    options={{
                        title: 'Add item',
                        headerRight: () => <CancelButton onPress={onCancelAdd}/>,
                    }}
                />
                <WhileAddingItem list={list} onCompleteAdd={onCompleteAdd}/>
            </>
        } else if (editingList) {
            return <>
                <Stack.Screen
                    options={{
                        title: 'Edit list',
                        headerRight: () => <CancelButton onPress={onCancelEdit}/>,
                    }}
                />
                <WhileEditingList list={list} onCompleteEdit={onCompleteEdit}/>
            </>
        } else {
            return <>
                <Stack.Screen
                    options={{
                        title: list.name,
                        headerRight: () => <EditButton onPress={onStartEdit}/>,
                    }}
                />
                <WhileViewingList list={list} onStartAdd={onStartAdd}/>
            </>
        }
    }

    return <>
        <Stack.Screen
            options={{
                title: 'Loading...',
                headerRight: () => null,
            }}
        />
        <View className='flex-1 bg-secondary'>
            <ActivityIndicator animating/>
        </View>
    </>
}
