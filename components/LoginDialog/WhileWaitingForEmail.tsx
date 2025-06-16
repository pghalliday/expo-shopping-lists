import * as React from "react";
import {useRef, useState} from "react";
import {ActivityIndicator, TextInput} from "react-native";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {supabase} from "~/lib/supabase";
import {DialogContent, DialogDescription} from "~/components/ui/dialog";

type WhileWaitingForEmailProps = {
    email: string,
    onCompleteEmail: (email: string) => void,
};

export function WhileWaitingForEmail({email, onCompleteEmail}: WhileWaitingForEmailProps) {
    const input = useRef<TextInput>(null);
    const [inputText, setInputText] = useState(email);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [working, setWorking] = useState(false);

    const ErrorText = () => {
        if (errorMessage) return (
            <Text>{errorMessage}</Text>
        );
        return null;
    };

    const onChangeText = (inputText: string) => {
        setInputText(inputText);
    };

    async function submit() {
        if (inputText !== '') {
            setWorking(true);
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
                onCompleteEmail(inputText);
            }
        }
    }

    return <DialogContent>
        <DialogDescription>
            Enter your email address to log in or create an account.
            You will then receive an email containing a one time log in code.
        </DialogDescription>
        <ErrorText/>
        <Input
            ref={input}
            autoFocus
            placeholder='Email address'
            autoComplete='email'
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='email-address'
            onChangeText={onChangeText}
            submitBehavior='submit'
            onSubmitEditing={submit}
            value={inputText}
            editable={!working}
        />
        <Button onPress={submit} disabled={working || inputText === ''}>
            <Text>Request code</Text>
        </Button>
        <ActivityIndicator animating={working}/>
    </DialogContent>
}
