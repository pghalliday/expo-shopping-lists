import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {LocalStorageService} from "~/lib/services/LocalStorageService";
import assert from "assert";

const currentListContext = createContext<string | undefined>(undefined);
const currentListStorageContext = createContext<LocalStorageService<string> | undefined>(undefined)

export function CurrentListProvider({storage, children}: PropsWithChildren<{
    storage: LocalStorageService<string>
}>) {
    const [currentList, setCurrentList] = useState<string>();
    const [isCurrentListLoaded, setIsCurrentListLoaded] = useState(false);

    useEffect(() => {
        storage.onValue(value => {
            setCurrentList(value);
            setIsCurrentListLoaded(true);
        });
    });

    if (!isCurrentListLoaded) {
        return null;
    }

    return <currentListStorageContext.Provider value={storage}>
        <currentListContext.Provider value={currentList}>
            {children}
        </currentListContext.Provider>
    </currentListStorageContext.Provider>
}

export function useCurrentList() {
    const storage = useContext(currentListStorageContext);
    assert(storage, 'Attempted to call useCurrentList() outside of <CurrentListProvider>');
    return {
        currentList: useContext(currentListContext),
        setCurrentList: (value: string | undefined) => storage.set(value),
    };
}
