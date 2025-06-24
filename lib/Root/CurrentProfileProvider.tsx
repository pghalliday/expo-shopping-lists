import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import Profile from "~/model/Profile";
import {useSupabaseSession} from "~/lib/Root/SupabaseSessionProvider";
import {database} from "~/model/database";
import {Q} from "@nozbe/watermelondb";
import {Subscription} from "rxjs";

const currentProfileContext = createContext<Profile | undefined>(undefined);

export function CurrentProfileProvider({children}: PropsWithChildren<{}>) {
    const session = useSupabaseSession();
    const [currentSubscription, setCurrentSubscription] = useState<Subscription>();
    const [currentProfile, setCurrentProfile] = useState<Profile>();

    useEffect(() => {
        if (currentSubscription) currentSubscription.unsubscribe();
        if (session) {
            setCurrentSubscription(
                database.get<Profile>('profiles')
                    .query(Q.where('user_id', session.user.id))
                    .observe()
                    .subscribe(profiles => {
                        if (profiles.length > 0) {
                            setCurrentProfile(profiles[0]);
                        } else {
                            setCurrentProfile(undefined);
                        }
                    })
            );
        } else {
            setCurrentSubscription(undefined);
            setCurrentProfile(undefined);
        }
    }, [session]);

    return (
        <currentProfileContext.Provider value={currentProfile}>
            {children}
        </currentProfileContext.Provider>
    );
}

export function useCurrentProfile() {
    return useContext(currentProfileContext);
}
