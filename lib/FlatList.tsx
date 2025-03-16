import {remapProps} from "nativewind";
import {FlatList} from "react-native";

remapProps(FlatList, {
    className: "style",
    ListFooterComponentClassName: "ListFooterComponentStyle",
    ListHeaderComponentClassName: "ListHeaderComponentStyle",
    columnWrapperClassName: "columnWrapperStyle",
    contentContainerClassName: "contentContainerStyle",
});

export { FlatList };
