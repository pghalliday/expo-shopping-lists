import {GestureResponderEvent, Pressable, View} from 'react-native';
import {cn} from '~/lib/utils';
import {Plus} from "~/lib/icons/Plus";

type PlusButtonProps = {
    onPress: (event: GestureResponderEvent) => void,
};

export function PlusButton({onPress}: PlusButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'
        >
            {({pressed}) => (
                <View
                    className={cn(
                        'flex-1 aspect-square absolute bottom-20 right-10',
                        pressed && 'opacity-70'
                    )}
                >
                    <Plus className='text-foreground' size={48} strokeWidth={2.5}/>
                </View>
            )}
        </Pressable>
    );
}
