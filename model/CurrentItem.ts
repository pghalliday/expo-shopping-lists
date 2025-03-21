import {Model, Q, Query, Relation} from "@nozbe/watermelondb";
import {date, immutableRelation, lazy, readonly, text} from "@nozbe/watermelondb/decorators";
import Item from "./Item";
import List from "./List";
import Source from "~/model/Source";

export default class CurrentItem extends Model {
    static table = 'current_items'
    static associations = {
        lists: { type: <const> 'belongs_to', key: 'list_id' },
        items: { type: <const> 'belongs_to', key: 'item_id' },
    }

    @text('list_id') listId!: string
    @text('item_id') itemId!: string
    @text('quantity') quantity!: number
    @readonly() @date('created_at') createdAt!: Date
    @readonly() @date('updated_at') updatedAt!: Date

    @immutableRelation('lists', 'list_id') list!: Relation<List>
    @immutableRelation('items', 'item_id') item!: Relation<Item>

    @lazy sources: Query<Source> = this.collections.get<Source>('sources').query(
        Q.on('item_sources', 'item_id', this.itemId),
    )
}
