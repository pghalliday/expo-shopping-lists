import * as React from 'react';
import {useRef, useState} from 'react';
import {ActivityIndicator, Keyboard, TextInput, View} from 'react-native';
import {Stack, useRouter} from "expo-router";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {supabase} from "~/lib/supabase";

export default function Screen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [working, setWorking] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const emailInput = useRef<TextInput>(null);

    const onChangeEmail = (email: string) => {
        setEmail(email);
    };

    const requestToken = async () => {
        setErrorMessage(null);
        Keyboard.dismiss();
        setWorking(true);
        const {error} = await supabase.auth.signInWithOtp({
            email,
        });
        setWorking(false);
        if (error) {
            setErrorMessage(error.message);
            setTimeout(() => {
                emailInput.current?.focus();
            }, 0);
        } else {
            router.replace({
                pathname: '/token',
                params: {email},
            });
        }
    };

    const ErrorText = () => {
        if (errorMessage) return (
            <Text>{errorMessage}</Text>
        );
        return null;
    };

    return (
        <>
            <Stack.Screen options={{title: "Enter Email"}}/>
            <View className='flex-1 bg-background p-6 gap-12'>
                <Text>
                    Enter your email address to log in or create an account.
                    You will then receive an email containing a one time log in code.
                </Text>
                <View className='gap-y-4'>
                    <ErrorText/>
                    <Input
                        ref={emailInput}
                        autoFocus
                        placeholder='Email address'
                        autoComplete='email'
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='email-address'
                        onChangeText={onChangeEmail}
                        onSubmitEditing={requestToken}
                        value={email}
                        editable={!working}
                    />
                    <Button onPress={requestToken} disabled={working}>
                        <Text>Request code</Text>
                    </Button>
                </View>
                <ActivityIndicator animating={working}/>
            </View>
        </>
    );
}
