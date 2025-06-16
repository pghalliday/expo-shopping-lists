import * as React from "react";
import {View} from "react-native";
import {Text} from "~/components/ui/text";
import {LoginDialog} from "~/components/LoginDialog";

export function WhileNotLinked() {
    function onLoginComplete() {
        console.log('Log in complete')
    }

    return (
        <View className='gap-y-4'>
            <Text>No account linked</Text>
            <LoginDialog buttonText='Link' onComplete={onLoginComplete}/>
        </View>
    );
}
