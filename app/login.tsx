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
    const [currentInstructions, setCurrentInstructions] = useState('Enter your email address to log in or create an account. You will then receive an email containing a one time log in code.')
    const [currentPlaceholder, setCurrentPlaceholder] = useState('Email address')
    const [currentAutoComplete, setCurrentAutoComplete] = useState<'email' | 'off'>('email')
    const [currentKeyboardType, setCurrentKeyboardType] = useState<'email-address' | 'number-pad'>('email-address')
    const [currentButtonText, setCurrentButtonText] = useState('Request code')
    const [currentAction, setCurrentAction] = useState<'requestCode' | 'verifyCode'>('requestCode')
    const [inputText, setInputText] = useState('');
    const [working, setWorking] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const input = useRef<TextInput>(null);

    const onChangeText = (inputText: string) => {
        setInputText(inputText);
    };

    const submit = async () => {
        if (inputText !== '') {
            setErrorMessage(null);
            Keyboard.dismiss();
            setWorking(true);
            if (currentAction === 'requestCode') {
                const {error} = await supabase.auth.signInWithOtp({
                    email: inputText,
                });
                setWorking(false);
                if (error) {
                    setErrorMessage(error.message);
                    setTimeout(() => {
                        input.current?.focus();
                    }, 0);
                } else {
                    setEmail(inputText);
                    setCurrentAction('verifyCode');
                    setCurrentInstructions('Enter the log in code sent to email address: ' + inputText)
                    setCurrentPlaceholder('Log in code')
                    setCurrentAutoComplete('off')
                    setCurrentKeyboardType('number-pad')
                    setCurrentButtonText('Log in')
                    setInputText('')
                    setTimeout(() => {
                        input.current?.focus();
                    }, 0)
                }
            } else {
                const {error} = await supabase.auth.verifyOtp({
                    email,
                    token: inputText,
                    type: 'email',
                })
                setWorking(false);
                if (error) {
                    setErrorMessage(error.message);
                    setTimeout(() => {
                        input.current?.focus();
                    }, 0)
                } else {
                    router.back();
                }
            }
        }
    }

    const ErrorText = () => {
        if (errorMessage) return (
            <Text>{errorMessage}</Text>
        );
        return null;
    };

    return (
        <>
            <Stack.Screen options={{title: "Log In"}}/>
            <View className='flex-1 bg-background p-6 gap-12'>
                <Text>{currentInstructions}</Text>
                <View className='gap-y-4'>
                    <ErrorText/>
                    <Input
                        ref={input}
                        autoFocus
                        placeholder={currentPlaceholder}
                        autoComplete={currentAutoComplete}
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType={currentKeyboardType}
                        onChangeText={onChangeText}
                        submitBehavior='submit'
                        onSubmitEditing={submit}
                        value={inputText}
                        editable={!working}
                    />
                    <Button onPress={submit} disabled={working || inputText === ''}>
                        <Text>{currentButtonText}</Text>
                    </Button>
                </View>
                <ActivityIndicator animating={working}/>
            </View>
        </>
    );
}
