// model/List.js
import {Model, Query} from '@nozbe/watermelondb'
import {children, date, readonly, text, writer} from "@nozbe/watermelondb/decorators";
import Item from "./Item";
import CurrentItem from "./CurrentItem";
import PreviousItem from "./PreviousItem";
import Source from "./Source";
import ItemSource from "~/model/ItemSource";

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
    @children('item_sources') itemSources!: Query<ItemSource>

    @writer async addSource(name: string) {
        return this.collections.get<Source>('sources').create((source: Source) => {
            source.listId = this.id;
            source.name = name;
        });
    }

    @writer async addItem(name: string, units: string) {
        return this.collections.get<Item>('items').create((item: Item) => {
            item.listId = this.id;
            item.name = name;
            item.units = units;
        });
    }

    async markAsDeleted() {
        await this.items.destroyAllPermanently();
        await this.sources.destroyAllPermanently();
        await this.currentItems.destroyAllPermanently();
        await this.previousItems.destroyAllPermanently();
        await this.itemSources.destroyAllPermanently();
        await super.markAsDeleted();
    }
}
