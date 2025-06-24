import * as React from "react";
import {createContext, PropsWithChildren, useCallback, useContext, useEffect, useState} from "react";
import {useSupabaseSession} from "~/lib/Root/SupabaseSessionProvider";
import {asyncScheduler, EMPTY, exhaustMap, from, retry, Subject, throttleTime, timer} from "rxjs";
import {useNetworkState} from "expo-network";
import {SyncDatabaseChangeSet, synchronize} from "@nozbe/watermelondb/sync";
import {database} from "~/model/database";
import {supabase} from "~/lib/supabase";
import SyncLogger from "@nozbe/watermelondb/sync/SyncLogger";

const logger = new SyncLogger(10);

class SyncService {
    private readonly syncNotifier = new Subject<void>();
    private stopped = false;

    constructor(throttleDuration: number, retryDelay: number) {
        this.syncNotifier
            .pipe(
                throttleTime(throttleDuration, asyncScheduler, {
                    leading: true,
                    trailing: true,
                }),
                exhaustMap(() => {
                    if (this.stopped) {
                        return EMPTY;
                    }
                    return from(synchronize({
                        database,
                        log: logger.newLog(),
                        pullChanges: async ({lastPulledAt, schemaVersion, migration}) => {
                            const {data, error} = await supabase.rpc('pull', {
                                p_last_pulled_at: lastPulledAt,
                            })
                            if (error) throw error
                            const {changes, timestamp} = data as {
                                changes: SyncDatabaseChangeSet
                                timestamp: number
                            }
                            return {changes, timestamp}
                        },
                        pushChanges: async ({changes, lastPulledAt}) => {
                            const {data: {user}} = await supabase.auth.getUser();
                            const {error} = await supabase.rpc('push', {
                                p_user_id: user!.id,
                                p_last_pulled_at: lastPulledAt,
                                p_changes: changes,
                            })
                            if (error) throw error
                        },
                        sendCreatedAsUpdated: true,
                    }))
                }),
                retry({
                    delay: ((error, retryCount) => {
                        console.error(error);
                        console.log('SyncService: retryCount: ', retryCount);
                        return timer(retryDelay);
                    }),
                    resetOnSuccess: true,
                })
            )
            .subscribe(() => {
                console.log(logger.formattedLogs)
            });
    }

    requestSync() {
        this.syncNotifier.next();
    }

    stop() {
        this.syncNotifier.complete();
        this.stopped = true;
    }
}

const syncContext = createContext<(() => void) | undefined>(undefined);

export function SyncProvider({throttleDuration, retryDelay, children}: PropsWithChildren<{ throttleDuration: number, retryDelay: number }>) {
    const networkState = useNetworkState();
    const session = useSupabaseSession();
    const [syncService, setSyncService] = useState<SyncService>();

    const sync = useCallback(() => {
        syncService?.requestSync();
    }, []);

    useEffect(() => {
        if (networkState.isInternetReachable && session) {
            const syncService = new SyncService(throttleDuration, retryDelay);
            setSyncService(syncService);
            syncService.requestSync();
        } else {
            if (syncService) {
                syncService.stop();
                setSyncService(undefined);
            }
        }
    }, [networkState, session]);

    return <syncContext.Provider value={sync}>
        {children}
    </syncContext.Provider>
}

export function useSync() {
    return useContext(syncContext);
}
