// First, create the adapter to the underlying database:
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import schema from "./schema";
import {Collection, Database} from "@nozbe/watermelondb";
import List from "./List";
import Item from "./Item";

const adapter = new SQLiteAdapter({
    schema,
    // (You might want to comment it out for development purposes -- see Migrations documentation)
    // migrations,
    // (optional database name or file system path)
    // dbName: 'myapp',
    // (recommended option, should work flawlessly out of the box on iOS. On Android,
    // additional installation steps have to be taken - disable if you run into issues...)
    jsi: true, /* Platform.OS === 'ios' */
    // (optional, but you should implement this method)
    onSetUpError: error => {
        // Database failed to load -- offer the user to reload the app or log out
    }
})

// Then, make a Watermelon database from it!
const database = new Database({
    adapter,
    modelClasses: [
        List,
        Item,
    ],
})

export const lists: Collection<List> = database.get<List>('lists');
