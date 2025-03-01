import * as React from "react";
import {Pressable, View} from "react-native";
import {Text} from "~/components/ui/text";
import {withObservables} from "@nozbe/watermelondb/react";
import {Link} from "expo-router";
import Source from "~/model/Source";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import {database} from "~/model/database";
import {DeleteButton} from "~/components/DeleteButton";

type SourceListItemProps = {
    source: Source,
};

function SourceListItem ({source}: SourceListItemProps) {
    async function deleteSource() {
        return database.write(async () => {
            await source.markAsDeleted();
        });
    }

    const renderActions = () => (
        <View className='p-3 mb-1 bg-red-600'>
            <DeleteButton onPress={deleteSource} />
        </View>
    );

    return (
        <ReanimatedSwipeable renderRightActions={renderActions}>
            <View className='p-3 mb-1 bg-background'>
                <Link
                    href={{
                        pathname: '/list/[id]',
                        params: {
                            id: source.id,
                        },
                    }}
                    asChild
                >
                    <Pressable>
                        <Text className='text-base font-semibold'>{source.name}</Text>
                    </Pressable>
                </Link>
            </View>
        </ReanimatedSwipeable>
    );
}

const enhance = withObservables(
    ['source'],
    ({ source }: {source: Source}) => ({
        source,
    })
);

export default enhance(SourceListItem);
