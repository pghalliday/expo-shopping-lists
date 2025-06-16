import * as React from "react";
import {View} from "react-native";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {signOutSupabase} from "~/lib/supabase";

type WhileLinkedProps = {
    email: string,
};

export function WhileLinked({email}: WhileLinkedProps) {
    async function unlink() {
        console.log('unlink');
        await signOutSupabase();
    }

    return (
        <View className='gap-y-4'>
            <Text>Linked with account: {email}</Text>
            <Button onPress={unlink}>
                <Text>Unlink</Text>
            </Button>
        </View>
    );
}
