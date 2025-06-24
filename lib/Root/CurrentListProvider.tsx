import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {LocalStorageService} from "~/lib/Root/LocalStorageService";
import {useDatabase} from "@nozbe/watermelondb/react";

const INITIAL_CURRENT_LIST: string | null = null;

const currentListContext = createContext<string | null>(INITIAL_CURRENT_LIST);
const currentListStorage = new LocalStorageService<string | null>('currentList', INITIAL_CURRENT_LIST);

export function CurrentListProvider({children}: PropsWithChildren<{}>) {
    const database = useDatabase();
    const [currentList, setCurrentList] = useState<string | null>(INITIAL_CURRENT_LIST);
    const [isCurrentListLoaded, setIsCurrentListLoaded] = useState(false);

    useEffect(() => {
        currentListStorage.onValue(database, value => {
            setCurrentList(value);
            setIsCurrentListLoaded(true);
        });
    }, [database]);

    if (!isCurrentListLoaded) {
        return null;
    }

    return (
        <currentListContext.Provider value={currentList}>
            {children}
        </currentListContext.Provider>
    );
}

export function useCurrentList() {
    const database = useDatabase();
    return {
        currentList: useContext(currentListContext),
        setCurrentList: (value: string | null) => currentListStorage.set(database, value),
    };
}
