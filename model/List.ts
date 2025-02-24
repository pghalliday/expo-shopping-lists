// model/List.js
import {Model, Q, Query} from '@nozbe/watermelondb'
import {children, date, lazy, readonly, text} from "@nozbe/watermelondb/decorators";
import Item from "./Item";
import CurrentItem from "./CurrentItem";
import PreviousItem from "./PreviousItem";
import Source from "./Source";

export default class List extends Model {
    static table = 'lists'
    static associations = {
        items: { type: <const> 'has_many', foreignKey: 'list_id' },
        sources: { type: <const> 'has_many', foreignKey: 'list_id' },
        current_items: { type: <const> 'has_many', foreignKey: 'list_id' },
        previous_items: { type: <const> 'has_many', foreignKey: 'list_id' },
        item_sources: { type: <const> 'has_many', foreignKey: 'list_id' },
    }

    @text('name') name!: string
    @readonly() @date('created_at') createdAt!: Date
    @readonly() @date('updated_at') updatedAt!: Date

    @children('items') items!: Query<Item>
    @children('sources') sources!: Query<Source>
    @children('current_items') currentItems!: Query<CurrentItem>
    @children('previous_items') previousItems!: Query<PreviousItem>
}
