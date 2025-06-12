import * as React from "react";
import {ActivityIndicator, View} from "react-native";
import {Stack} from "expo-router";
import {SettingsButton} from "~/components/SettingsButton";
import {useEffect, useState} from "react";
import List from "~/model/List";
import {database} from "~/model/database";
import {WhileAddingItem} from "~/components/CurrentList/WithCurrentList/WhileAddingItem";
import {WhileViewingList} from "~/components/CurrentList/WithCurrentList/WhileViewingList";

type WithCurrentListProps = {
    currentList: string,
};

export function WithCurrentList({currentList}: WithCurrentListProps) {
    const [list, setList] = useState<List>();
    const [addingItem, setAddingItem] = useState(false);

    useEffect(() => {
        const findList = async () => {
            const list = await database.get<List>('lists').find(currentList)
            setList(list);
        }
        findList().catch(console.error)
    })

    const onStartAdd = () => {
        setAddingItem(true);
    }

    const onCompleteAdd = () => {
        setAddingItem(false);
    }

    if (list !== undefined) {
        const StackScreen = () => <Stack.Screen
            options={{
                title: list.name,
                headerRight: () => <SettingsButton/>,
            }}
        />
        if (addingItem) {
            return <>
                <StackScreen/>
                <WhileAddingItem list={list} onCompleteAdd={onCompleteAdd}/>
            </>
        } else {
            return <>
                <StackScreen/>
                <WhileViewingList list={list} onStartAdd={onStartAdd}/>
            </>
        }
    }

    return <>
        <Stack.Screen
            options={{
                title: 'Loading...',
                headerRight: () => <SettingsButton/>,
            }}
        />
        <View className='flex-1 bg-secondary'>
            <ActivityIndicator animating/>
        </View>
    </>
}
