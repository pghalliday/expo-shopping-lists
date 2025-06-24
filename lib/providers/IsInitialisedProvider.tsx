import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {LocalStorageService} from "~/lib/services/LocalStorageService";
import assert from "assert";

const IsInitializedContext = createContext<boolean | undefined>(undefined);
const IsInitializedStorageContext = createContext<LocalStorageService<boolean> | undefined>(undefined);

export function IsInitializedProvider({storage, children}: PropsWithChildren<{
    storage: LocalStorageService<boolean>
}>) {
    const [isInitialized, setIsInitialized] = useState<boolean>();
    const [isIsInitializedLoaded, setIsIsInitializedLoaded] = useState(false);

    useEffect(() => {
        storage.onValue(value => {
            setIsInitialized(value);
            setIsIsInitializedLoaded(true);
        });
    }, []);

    if (!isIsInitializedLoaded) {
        return null;
    }

    return <IsInitializedStorageContext.Provider value={storage}>
        <IsInitializedContext.Provider value={isInitialized}>
            {children}
        </IsInitializedContext.Provider>
    </IsInitializedStorageContext.Provider>
}

export function useIsInitialized() {
    const storage = useContext(IsInitializedStorageContext);
    assert(storage, 'Attempted to call useIsInitialized() outside of <IsInitializedProvider>');
    return {
        isInitialized: useContext(IsInitializedContext) ?? false,
        setIsInitialized: (value: boolean) => storage.set(value),
    };
}
