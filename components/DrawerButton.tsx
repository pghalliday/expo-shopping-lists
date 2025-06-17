import {Pressable, View} from 'react-native';
import {cn} from '~/lib/utils';
import * as React from "react";
import {useNavigation} from "expo-router";
import {Menu} from "~/lib/icons/Menu";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import {ParamListBase} from "@react-navigation/native";

export function DrawerButton() {
    const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

    const toggleDrawer = () => navigation.toggleDrawer();

    return <Pressable
        onPress={toggleDrawer}
        className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'
    >
        {({pressed}) => (
            <View
                className={cn(
                    'flex-1 aspect-square pt-0.5 pl-2 justify-center items-start web:px-5',
                    pressed && 'opacity-70'
                )}
            >
                <Menu className='text-foreground' size={24} strokeWidth={1.25}/>
            </View>
        )}
    </Pressable>
}
