import * as React from "react";
import {Pressable, View} from 'react-native';
import {cn} from '~/lib/utils';
import {Edit} from "~/lib/icons/Edit";

type EditButtonProps = {
    onPress: () => void,
};

export function EditButton({onPress}: EditButtonProps) {
    return <Pressable
        onPress={onPress}
        className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'
    >
        {({pressed}) => (
            <View
                className={cn(
                    'flex-1 aspect-square pt-0.5 pl-2 justify-center items-start web:px-5',
                    pressed && 'opacity-70'
                )}
            >
                <Edit className='text-foreground' size={24} strokeWidth={1.25}/>
            </View>
        )}
    </Pressable>
}
