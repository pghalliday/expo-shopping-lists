import {Link} from "expo-router";
import * as React from "react";
import {useEffect, useState} from "react";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {supabase} from "~/lib/supabase";
import {Session} from "@supabase/auth-js";
import {View} from "react-native";

export function Auth() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    const logOut = () => supabase.auth.signOut();

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
