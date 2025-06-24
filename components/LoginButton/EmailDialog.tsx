import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {Input} from "~/components/ui/input";
import {ActivityIndicator, ScrollView, TextInput} from "react-native";
import {useIsInitialized} from "~/lib/providers/IsInitialisedProvider";
import {useSupabase} from "~/lib/providers/SupabaseProvider";

type EmailDialogProps = {
    open: boolean,
    onComplete: (email: string) => void,
    onCancel: () => void,
};

export function EmailDialog({open, onComplete, onCancel}: EmailDialogProps) {
    const {isInitialized} = useIsInitialized();
    const supabase = useSupabase();
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

    const onChangeText = useCallback((inputText: string) => {
        setInputText(inputText);
    }, []);

    const submit = useCallback(async () => {
        if (supabase) {
            if (inputText !== '') {
                setWorking(true);
                const {error} = await supabase.auth.signInWithOtp({
                    email: inputText,
                    options: {
                        data: {
                            firstRun: isInitialized,
                        },
                    },
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
    }, [supabase, inputText])

    return <Dialog open={open} onOpenChange={() => onCancel()}>
        <DialogContent className='min-w-full mt-10'>
            <DialogHeader>
                <DialogTitle>Log in</DialogTitle>
                <DialogDescription>
                    Enter your email address to log in or create an account.
                    You will then receive an email containing a one time log in code.
                </DialogDescription>
            </DialogHeader>
            <ScrollView>
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
            </ScrollView>
            <DialogFooter>
                <Button onPress={submit} disabled={working || inputText === ''}>
                    <Text>Request code</Text>
                </Button>
                <ActivityIndicator animating={working}/>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}
