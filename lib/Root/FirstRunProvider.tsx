import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {LocalStorageService} from "~/lib/Root/LocalStorageService";

const INITIAL_FIRST_RUN = true;

const firstRunContext = createContext<boolean>(INITIAL_FIRST_RUN);
const firstRunStorage = new LocalStorageService<boolean>('firstRun', INITIAL_FIRST_RUN);

export function FirstRunProvider({children}: PropsWithChildren<{}>) {
  const [ firstRun, setFirstRun ] = useState<boolean>(INITIAL_FIRST_RUN);

  useEffect(() => {
    firstRunStorage.onValue(value => setFirstRun(value));
  }, []);

  return (
      <firstRunContext.Provider value={firstRun}>
        {children}
      </firstRunContext.Provider>
  );
}

export function useFirstRun() {
  return {
    firstRun: useContext(firstRunContext),
    setFirstRun: (value: boolean) => firstRunStorage.set(value),
  };
}
