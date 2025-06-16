import {FlatList} from "~/lib/FlatList";
import * as React from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Model} from "@nozbe/watermelondb";
import {Pressable, View} from "react-native";
import {DeleteButton} from "~/components/DeleteButton";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import {Text} from "~/components/ui/text";
import {withObservables} from "@nozbe/watermelondb/react";

interface ModelListController<T extends Model, P> {
    getListText(props: P): string;

    delete(props: P): Promise<void>;

    onPress(props: P): void;

    // TODO: This `any` satisfies the type checking but ideally this should be better
    // TODO: defined in terms of `P` and in compliance with watermelondb types used
    // TODO: in `withObservables`
    getObservables(props: { model: T }): any;
}

function createModelListItem<T extends Model, P>(controller: ModelListController<T, P>) {
    return function ModelListItem(props: P) {
        async function deleteModel() {
            await controller.delete(props);
        }

        function onPress() {
            controller.onPress(props);
        }

        const renderActions = () => (
            <View className='p-3 mb-1 bg-red-600'>
                <DeleteButton onPress={deleteModel}/>
            </View>
        );

        return (
            <ReanimatedSwipeable renderRightActions={renderActions}>
                <View className='p-3 mb-1 bg-background'>
                    <Pressable onPress={onPress}>
                        <Text className='text-base font-semibold'>{controller.getListText(props)}</Text>
                    </Pressable>
                </View>
            </ReanimatedSwipeable>
        );
    }
}

export function createModelList<T extends Model, P>(controller: ModelListController<T, P>) {
    type ModelListProps = {
        models: T[],
    };

    const enhanceItemElement = withObservables(
        ['model'],
        controller.getObservables,
    );

    const ModelListItem = enhanceItemElement(createModelListItem(controller));

    function ModelList({models}: ModelListProps) {
        return (
            <GestureHandlerRootView>
                <FlatList
                    data={models}
                    renderItem={({item}) => <ModelListItem model={item}/>}
                    keyExtractor={model => model.id}
                />
            </GestureHandlerRootView>
        );
    }

    const enhanceListElement = withObservables(
        ['models'],
        ({models}: { models: T[] }) => ({
            models: models,
        })
    );

    return enhanceListElement(ModelList);
}
