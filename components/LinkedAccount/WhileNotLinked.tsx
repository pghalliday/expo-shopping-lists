import * as React from "react";
import {View} from "react-native";
import {Text} from "~/components/ui/text";
import {LoginButton} from "~/components/LoginButton";

export function WhileNotLinked() {
    function onLoginComplete() {
        console.log('Log in complete')
    }

    return (
        <View className='gap-y-4'>
            <Text>No account linked</Text>
            <LoginButton label='Link'/>
        </View>
    );
}
