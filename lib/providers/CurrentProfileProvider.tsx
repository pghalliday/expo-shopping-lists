import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import Profile from "~/model/Profile";
import {useSupabaseSession} from "~/lib/providers/SessionProvider";
import {Database, Q} from "@nozbe/watermelondb";
import {Subscription} from "rxjs";
import assert from "assert";

const currentProfileContext = createContext<Profile | null | undefined>(undefined);

export function CurrentProfileProvider({database, children}: PropsWithChildren<{ database: Database }>) {
    const session = useSupabaseSession();
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

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
                            setCurrentProfile(null);
                        }
                    })
            );
        } else {
            setCurrentSubscription(null);
            setCurrentProfile(null);
        }
    }, [session]);

    return (
        <currentProfileContext.Provider value={currentProfile}>
            {children}
        </currentProfileContext.Provider>
    );
}

export function useCurrentProfile() {
    const profile = useContext(currentProfileContext);
    assert(profile !== undefined, 'Attempted to call useCurrentProfile() outside of <CurrentProfileProvider>');
    return profile;
}
