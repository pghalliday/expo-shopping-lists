import * as React from "react";
import {createContext, PropsWithChildren, useCallback, useContext} from "react";
import {useDatabase} from "@nozbe/watermelondb/react";
import List from "~/model/List";
import CurrentItem from "~/model/CurrentItem";
import Item from "~/model/Item";
import Profile from "~/model/Profile";
import {useSync} from "~/lib/Root/SyncProvider";

const apiContext = createContext<{
    resetDatabase: () => Promise<void>,
    addList: (name: string) => Promise<List>,
    addCurrentItem: (listId: string, name: string) => Promise<CurrentItem>,
    updateList: (list: List, name: string) => Promise<List>,
    updateProfileDisplayName: (profile: Profile, displayName: string) => Promise<Profile>,
} | undefined>(undefined);

export function ApiProvider({children}: PropsWithChildren<{}>) {
    const database = useDatabase();
    const sync = useSync();

    const resetDatabase = useCallback(async () => {
        await database.write(async () => {
            return database.unsafeResetDatabase();
        });
        sync();
    }, [database, sync]);

    const addList = useCallback(async (name: string) => {
        const list = await database.write(async () => {
            return database.get<List>('lists').create(list => {
                list.name = name;
            });
        });
        sync();
        return list;
    }, [database, sync]);

    const addCurrentItem = useCallback(async (listId: string, name: string) => {
        const currentItem = await database.write(async () => {
            const item = await database.get<Item>('items').create(item => {
                item.listId = listId;
                item.name = name;
            });
            return database.get<CurrentItem>('current_items').create(currentItem => {
                currentItem.itemId = item.id;
                currentItem.listId = listId;
            });
        });
        sync();
        return currentItem;
    }, [database, sync]);

    const updateList = useCallback(async (list: List, name: string) => {
        const newList = await database.write(async () => {
            return list.update(list => {
                list.name = name;
            });
        });
        sync();
        return newList;
    }, [database, sync]);

    const updateProfileDisplayName = useCallback(async (profile: Profile, displayName: string) => {
        const newProfile = await database.write(async () => {
            return profile.update(profile => {
                profile.displayName = displayName;
            });
        });
        sync();
        return newProfile;
    }, [database, sync]);

    return <apiContext.Provider value={{
        resetDatabase,
        addList,
        addCurrentItem,
        updateList,
        updateProfileDisplayName,
    }}>
        {children}
    </apiContext.Provider>
}

export function useApi() {
    return useContext(apiContext);
}
