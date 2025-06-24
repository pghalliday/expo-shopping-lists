import * as React from "react";
import {View} from "react-native";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {useSupabase} from "~/lib/providers/SupabaseProvider";
import {useCallback} from "react";

type WhileLinkedProps = {
    email: string,
};

export function WhileLinked({email}: WhileLinkedProps) {
    const supabase = useSupabase();

    const unlink = useCallback(async () => {
        if (supabase) {
            console.log('unlink');
            await supabase.auth.signOut();
        }
    }, [supabase])

    return (
        <View className='gap-y-4'>
            <Text>Linked with account: {email}</Text>
            <Button onPress={unlink}>
                <Text>Unlink</Text>
            </Button>
        </View>
    );
}
