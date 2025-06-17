import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Dialog, DialogContent, DialogDescription} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {Input} from "~/components/ui/input";
import {ActivityIndicator, TextInput} from "react-native";
import {supabase} from "~/lib/supabase";

type CodeDialogProps = {
    open: boolean,
    email: string,
    onComplete: () => void,
    onCancel: () => void,
};

export function CodeDialog({open, email, onComplete, onCancel}: CodeDialogProps) {
    const input = useRef<TextInput>(null);
    const [inputText, setInputText] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [working, setWorking] = useState(false);

    useEffect(() => {
        setInputText('');
        setErrorMessage(null);
        setWorking(false);
    }, [open]);

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
                onComplete();
            }
        }
    }

    return <Dialog open={open} onOpenChange={() => onCancel()}>
        <DialogContent>
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
    </Dialog>
}
