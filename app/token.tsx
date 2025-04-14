import * as React from 'react';
import {useRef, useState} from 'react';
import {ActivityIndicator, Keyboard, TextInput, View} from 'react-native';
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {supabase} from "~/lib/supabase";

export default function Screen() {
    const router = useRouter();
    const {email} = useLocalSearchParams<{email: string}>();
    const [working, setWorking] = useState(false);
    const [token, setToken] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const tokenInput = useRef<TextInput>(null);

    const onChangeToken = (token: string) => {
        setToken(token);
    };

    const verifyToken = async () => {
        setErrorMessage(null);
        Keyboard.dismiss();
        setWorking(true);
        const {error} = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        })
        setWorking(false);
        if (error) {
            setErrorMessage(error.message);
            setTimeout(() => {
                tokenInput.current?.focus();
            }, 0)
        } else {
            router.back();
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
            <Stack.Screen options={{title: "Enter Code"}}/>
            <View className='flex-1 bg-background p-6 gap-12'>
                <Text>
                    Enter the log in code sent to email address: {email}
                </Text>
                <View className='gap-y-4'>
                    <ErrorText/>
                    <Input
                        ref={tokenInput}
                        autoFocus
                        placeholder='Log in code'
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='number-pad'
                        onChangeText={onChangeToken}
                        onSubmitEditing={verifyToken}
                        value={token}
                        editable={!working}
                    />
                    <Button onPress={verifyToken} disabled={working}>
                        <Text>Log In</Text>
                    </Button>
                </View>
                <ActivityIndicator animating={working}/>
            </View>
        </>
    );
}
