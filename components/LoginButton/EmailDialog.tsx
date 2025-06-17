import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {Input} from "~/components/ui/input";
import {ActivityIndicator, TextInput} from "react-native";
import {supabase} from "~/lib/supabase";

type EmailDialogProps = {
    open: boolean,
    onComplete: (email: string) => void,
    onCancel: () => void,
};

export function EmailDialog({open, onComplete, onCancel}: EmailDialogProps) {
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
                onComplete(inputText);
            }
        }
    }

    return <Dialog open={open} onOpenChange={() => onCancel()}>
        <DialogContent className='min-w-full'>
            <DialogHeader>
                <DialogTitle>Log in</DialogTitle>
                <DialogDescription>
                    Enter your email address to log in or create an account.
                    You will then receive an email containing a one time log in code.
                </DialogDescription>
            </DialogHeader>
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
    </Dialog>
}
