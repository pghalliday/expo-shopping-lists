import {Model, Q, Query, Relation} from "@nozbe/watermelondb";
import {children, date, immutableRelation, lazy, readonly, text, writer} from "@nozbe/watermelondb/decorators";
import List from "./List";
import PreviousItem from "./PreviousItem";
import ItemSource from "./ItemSource";
import CurrentItem from "./CurrentItem";
import Item from "./Item";
import assert from "assert";

export default class Source extends Model {
    static table = 'sources'
    static associations = {
        lists: { type: <const> 'belongs_to', key: 'list_id' },
        previous_items: { type: <const> 'has_many', foreignKey: 'source_id' },
        item_sources: { type: <const> 'has_many', foreignKey: 'source_id' },
    }

    @text('list_id') listId!: string
    @text('name') name!: string
    @readonly() @date('created_at') createdAt!: Date
    @readonly() @date('updated_at') updatedAt!: Date

    @immutableRelation('lists', 'list_id') list!: Relation<List>

    @children('previous_items') previousItems!: Query<PreviousItem>
    @children('item_sources') itemSources!: Query<ItemSource>

    @lazy items: Query<Item> = this.collections.get<Item>('items').query(
        Q.on('item_sources', 'source_id', this.id),
    )
    @lazy currentItems: Query<CurrentItem> = this.collections.get<CurrentItem>('current_items').query(
        Q.experimentalNestedJoin('items', 'item_sources'),
        Q.on('items', Q.on('item_sources', 'source_id', this.id)),
    )

    @writer async addItem(item: Item) {
        assert(item.listId === this.listId);
        return this.collections.get<ItemSource>('item_sources').create((itemSource: ItemSource) => {
            itemSource.itemId = item.id;
            itemSource.listId = this.listId;
            itemSource.sourceId = this.id;
        });
    }

    async markAsDeleted() {
        await this.previousItems.destroyAllPermanently();
        await this.itemSources.destroyAllPermanently();
        await super.markAsDeleted();
    }
}
