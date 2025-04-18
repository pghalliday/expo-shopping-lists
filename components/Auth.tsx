import {Link} from "expo-router";
import * as React from "react";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {supabase, useSupabaseSession} from "~/lib/supabase";
import {View} from "react-native";

export function Auth() {
    const session = useSupabaseSession();

    const logOut = () => {
        console.log('logOut');
        supabase.auth.signOut({scope: 'local'}).then(({error}) => {
            console.log(error);
            // TODO: sometimes we get an AuthSessionMissingError even though there seems
            // TODO: to be a session. This may be related to a refresh of the app and the
            // TODO: following code works around the problem by setting the session again
            // TODO: before trying to signOut
            // supabase.auth.getSession().then(({data: {session}, error}) => {
            //     console.log(error);
            //     console.log(session);
            //     supabase.auth.setSession(session!).then(() => {
            //         supabase.auth.signOut({scope: 'local'}).then(({error}) => {
            //             console.log(error);
            //         });
            //     });
            // });
        });
    }

    if (!session) return (
        <Link
            href="/email"
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
