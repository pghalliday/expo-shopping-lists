import {Database} from "@nozbe/watermelondb";
import {inject, singleton} from "tsyringe";
import {ThemeSetting} from "~/lib/providers/ThemeSettingProvider";
import {DATABASE} from "~/tsyringe/symbols";

export class LocalStorageService<T> {
    private onValueCallback?: ((value: T | undefined) => void);

    constructor(
        private readonly database: Database,
        private readonly key: string,
    ) {
    }

    async set(value?: T) {
        if (value === undefined) {
            await this.database.localStorage.remove(this.key);
        } else {
            await this.database.localStorage.set<T>(this.key, value);
        }
        this.onValueCallback?.(value);
    }

    onValue(callback: (value: T | undefined) => void) {
        this.database.localStorage.get<T>(this.key).then((value) => {
            callback(value ?? undefined);
        });
        this.onValueCallback = callback;
    }
}

@singleton()
export class IsInitializedLocalStorage extends LocalStorageService<boolean> {
    constructor(
        @inject(DATABASE) database: Database,
    ) {
        super(database, 'isInitialized');
    }
}

@singleton()
export class ThemeSettingLocalStorage extends LocalStorageService<ThemeSetting> {
    constructor(
        @inject(DATABASE) database: Database,
    ) {
        super(database, 'themeSetting');
    }
}

@singleton()
export class CurrentListLocalStorage extends LocalStorageService<string> {
    constructor(
        @inject(DATABASE) database: Database,
    ) {
        super(database, 'currentList');
    }
}

