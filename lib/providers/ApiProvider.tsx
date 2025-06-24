import * as React from "react";
import {createContext, PropsWithChildren, useContext} from "react";
import assert from "assert";
import {Api} from "~/lib/services/Api";

const apiContext = createContext<Api | undefined>(undefined);

export function ApiProvider({api, children}: PropsWithChildren<{ api: Api }>) {
    return <apiContext.Provider value={api}>
        {children}
    </apiContext.Provider>
}

export function useApi() {
    const api = useContext(apiContext);
    assert(api, 'Attempted to call useApi() outside of <ApiProvider>');
    return api;
}
