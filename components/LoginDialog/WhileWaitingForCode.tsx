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
    onCompleteCode: () => void,
};

export function WhileWaitingForCode({email, onCompleteCode}: WhileWaitingForEmailProps) {
    const input = useRef<TextInput>(null);
    const [inputText, setInputText] = useState('');
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
                onCompleteCode();
            }
        }
    }

    return <DialogContent>
        <DialogDescription>
            Enter the log in code sent to email address: {email}
        </DialogDescription>
        <ErrorText/>
        <Input
            ref={input}
            autoFocus
            placeholder='Log in code'
            autoComplete='off'
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='number-pad'
            onChangeText={onChangeText}
            submitBehavior='submit'
            onSubmitEditing={submit}
            value={inputText}
            editable={!working}
        />
        <Button onPress={submit} disabled={working || inputText === ''}>
            <Text>Log in</Text>
        </Button>
        <ActivityIndicator animating={working}/>
    </DialogContent>
}
