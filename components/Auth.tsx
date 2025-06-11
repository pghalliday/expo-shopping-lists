import {Link} from "expo-router";
import * as React from "react";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {signOutSupabase, supabase} from "~/lib/supabase";
import {View} from "react-native";
import {useSupabaseSession} from "~/lib/Root/SupabaseSessionProvider";

export function Auth() {
    const session = useSupabaseSession();

    const logOut = async () => {
        console.log('logOut');
        await signOutSupabase();
    }

    if (!session) return (
        <Link
            href="/login"
            asChild
        >
            <Button>
                <Text>Log In</Text>
            </Button>
        </Link>
    );

    return (
        <View className='gap-y-4'>
            <Text>{session.user.email}</Text>
            <Button onPress={logOut}>
                <Text>Log Out</Text>
            </Button>
        </View>
    );
}
