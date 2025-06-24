import * as React from "react";
import {createContext, PropsWithChildren, useCallback, useContext, useEffect, useState} from "react";
import {useSupabaseSession} from "~/lib/Root/SupabaseSessionProvider";
import {asyncScheduler, EMPTY, exhaustMap, from, retry, Subject, throttleTime, timer} from "rxjs";
import {useNetworkState} from "expo-network";
import {SyncDatabaseChangeSet, synchronize} from "@nozbe/watermelondb/sync";
import {supabase} from "~/lib/supabase";
import SyncLogger from "@nozbe/watermelondb/sync/SyncLogger";
import {useDatabase} from "@nozbe/watermelondb/react";
import assert from "assert";

const syncContext = createContext<(() => void) | undefined>(undefined);

export function SyncProvider({throttleDuration, retryDelay, children}: PropsWithChildren<{
    throttleDuration: number,
    retryDelay: number
}>) {
    const database = useDatabase();
    const logger = new SyncLogger(10);

    class SyncService {
        private readonly syncNotifier = new Subject<void>();
        private stopped = false;

        constructor(throttleDuration: number, retryDelay: number, userId: string) {
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
                                const {error} = await supabase.rpc('push', {
                                    p_user_id: userId,
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
                            console.log(error);
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

    const networkState = useNetworkState();
    const session = useSupabaseSession();
    const [syncService, setSyncService] = useState<SyncService>();

    const sync = useCallback(() => {
        console.log('SyncProvider: sync requested:', syncService);
        syncService?.requestSync();
    }, [syncService]);

    useEffect(() => {
        console.log('SyncProvider: isInternetReachable:', networkState.isInternetReachable);
        console.log('SyncProvider: session:', session);
        if (networkState.isInternetReachable && session) {
            if (!syncService) {
                console.log('SyncProvider: create new sync service');
                const syncService = new SyncService(throttleDuration, retryDelay, session.user.id);
                setSyncService(syncService);
                syncService.requestSync();
            }
        } else if (syncService) {
            console.log('SyncProvider: stop and release sync service');
            syncService.stop();
            setSyncService(undefined);
        }
    }, [networkState, session]);

    return <syncContext.Provider value={sync}>
        {children}
    </syncContext.Provider>
}

export function useSync() {
    const sync = useContext(syncContext);
    assert(sync, 'Could not find sync context, please make sure the component is wrapped in the <SyncProvider>');
    return sync;
}
