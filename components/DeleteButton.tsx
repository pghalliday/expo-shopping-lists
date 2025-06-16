import {GestureResponderEvent, Pressable, View} from 'react-native';
import {cn} from '~/lib/utils';
import {Trash2} from "~/lib/icons/Trash2";

type DeleteButtonProps = {
    onPress: (event: GestureResponderEvent) => void,
};

export function DeleteButton({onPress}: DeleteButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'
        >
            {({pressed}) => (
                <View
                    className={cn(
                        'flex-1 aspect-square',
                        pressed && 'opacity-70'
                    )}
                >
                    <Trash2 className='bg-red-600 text-white'/>
                </View>
            )}
        </Pressable>
    );
}
