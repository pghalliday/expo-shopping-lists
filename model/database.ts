import {Database} from "@nozbe/watermelondb";
import List from "./List";
import Item from "./Item";
import Source from "~/model/Source";
import CurrentItem from "~/model/CurrentItem";
import PreviousItem from "~/model/PreviousItem";
import ItemSource from "~/model/ItemSource";
import {adapter} from "~/model/adapter";
import Profile from "~/model/Profile";

export const database = new Database({
    adapter,
    modelClasses: [
        Profile,
        List,
        Source,
        Item,
        CurrentItem,
        PreviousItem,
        ItemSource,
    ],
})
