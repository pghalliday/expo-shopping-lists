import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {LocalStorageService} from "~/lib/Root/LocalStorageService";
import {useDatabase} from "@nozbe/watermelondb/react";
import {database} from "~/model/database";

const INITIAL_FIRST_RUN = true;

const firstRunContext = createContext<boolean>(INITIAL_FIRST_RUN);
const firstRunStorage = new LocalStorageService<boolean>('firstRun', INITIAL_FIRST_RUN);

export function FirstRunProvider({children}: PropsWithChildren<{}>) {
    const database = useDatabase();
    const [firstRun, setFirstRun] = useState<boolean>(INITIAL_FIRST_RUN);
    const [isFirstRunLoaded, setIsFirstRunLoaded] = useState(false);

    useEffect(() => {
        firstRunStorage.onValue(database, value => {
            setFirstRun(value);
            setIsFirstRunLoaded(true);
        });
    }, [database]);

    if (!isFirstRunLoaded) {
        return null;
    }

    return (
        <firstRunContext.Provider value={firstRun}>
            {children}
        </firstRunContext.Provider>
    );
}

export function useFirstRun() {
    const database = useDatabase();
    return {
        firstRun: useContext(firstRunContext),
        setFirstRun: (value: boolean) => firstRunStorage.set(database, value),
    };
}
