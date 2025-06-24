import {Database} from "@nozbe/watermelondb";

export class LocalStorageService<T> {
    private onValueCallback?: ((value: T) => void);

    constructor(private readonly key: string, private readonly defaultValue: T) {
    }

    async set(database: Database, value: T) {
        await database.localStorage.set<T>(this.key, value);
        this.onValueCallback?.(value);
    }

    onValue(database: Database, callback: (value: T) => void) {
        database.localStorage.get<T>(this.key).then((value) => {
            callback(value ?? this.defaultValue);
        });
        this.onValueCallback = callback;
    }
}
