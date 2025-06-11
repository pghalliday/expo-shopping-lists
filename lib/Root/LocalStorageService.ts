import {database} from "~/model/database";

export class LocalStorageService<T> {
    private onValueCallback?: ((value: T) => void);

    constructor(private readonly key: string, private readonly defaultValue: T) {
    }

    async set(value: T) {
        await database.localStorage.set<T>(this.key, value);
        if (this.onValueCallback) this.onValueCallback((value));
    }

    onValue(callback: (value: T) => void) {
        database.localStorage.get<T>(this.key).then((value) => {
            callback(value ?? this.defaultValue);
        });
        this.onValueCallback = callback;
    }
}
