import * as React from 'react';
import {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Stack, useRouter} from "expo-router";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {supabase} from "~/lib/supabase";

export default function Screen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [working, setWorking] = useState(false);
    const [waitingForToken, setWaitingForToken] = useState(false);
    const [token, setToken] = useState('');

    const onChangeEmail = (email: string) => {
        setEmail(email);
    };

    const onChangeToken = (token: string) => {
        setToken(token);
    };

    const sendToken = async () => {
        setWorking(true);
        const {error} = await supabase.auth.signInWithOtp({
            email,
        });
        setWorking(false);
        // TODO: handle errors
        if (error) throw error;
        setWaitingForToken(true);
    };

    const verifyToken = async () => {
        setWorking(true);
        const {error} = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        })
        setWorking(false);
        // TODO: handle errors
        if (error) throw error;
        router.back();
    };

    if (waitingForToken) return (
        <>
            <ActivityIndicator animating={working}/>
            <Stack.Screen options={{title: "Enter Code"}}/>
            <View className='flex-1 bg-background p-6 gap-12'>
                <Text>
                    Enter the log in code sent to email address: {email}
                </Text>
                <View className='gap-y-4'>
                    <Input
                        nativeID='token'
                        placeholder='Log in code'
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='number-pad'
                        onChangeText={onChangeToken}
                        value={token}
                    />
                    <Button onPress={verifyToken}>
                        <Text>Log In</Text>
                    </Button>
                </View>
            </View>
        </>
    );

    return (
        <>
            <ActivityIndicator animating={working}/>
            <Stack.Screen options={{title: "Enter Email"}}/>
            <View className='flex-1 bg-background p-6 gap-12'>
                <Text>
                    Enter your email address to log in or create an account.
                    You will then receive an email containing a one time log in code.
                </Text>
                <View className='gap-y-4'>
                    <Input
                        nativeID='email'
                        placeholder='Email address'
                        autoComplete='email'
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='email-address'
                        onChangeText={onChangeEmail}
                        value={email}
                    />
                    <Button onPress={sendToken}>
                        <Text>Request code</Text>
                    </Button>
                </View>
            </View>
        </>
    );
}
