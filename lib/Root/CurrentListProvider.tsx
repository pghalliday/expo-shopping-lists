import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {LocalStorageService} from "~/lib/Root/LocalStorageService";

const INITIAL_CURRENT_LIST: string | null = null;

const currentListContext = createContext<string | null>(INITIAL_CURRENT_LIST);
const currentListStorage = new LocalStorageService<string | null>('currentList', INITIAL_CURRENT_LIST);

export function CurrentListProvider({children}: PropsWithChildren<{}>) {
    const [currentList, setCurrentList] = useState<string | null>(INITIAL_CURRENT_LIST);
    const [isCurrentListLoaded, setIsCurrentListLoaded] = useState(false);

    useEffect(() => {
        currentListStorage.onValue(value => {
            setCurrentList(value);
            setIsCurrentListLoaded(true);
        });
    }, []);

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
    return {
        currentList: useContext(currentListContext),
        setCurrentList: (value: string | null) => currentListStorage.set(value),
    };
}
