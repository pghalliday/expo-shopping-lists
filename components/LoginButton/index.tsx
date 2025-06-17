import * as React from "react";
import {useState} from "react";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {EmailDialog} from "~/components/LoginButton/EmailDialog";
import {CodeDialog} from "~/components/LoginButton/CodeDialog";

export type LoginButtonProps = {
    label: string,
    onComplete?: () => void,
    onCancel?: () => void,
}

export function LoginButton({label, onComplete, onCancel}: LoginButtonProps) {
    const [emailOpen, setEmailOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [codeOpen, setCodeOpen] = useState(false);

    function start() {
        setEmailOpen(true);
    }

    function onEmailCancel() {
        setEmailOpen(false);
        onCancel?.();
    }

    function onEmailComplete(email: string) {
        setEmail(email);
        setEmailOpen(false);
        // This timeout ensures that the autofocus for the code dialog works
        setTimeout(() => setCodeOpen(true), 0);
    }

    function onCodeCancel() {
        setCodeOpen(false);
        onCancel?.();
    }

    function onCodeComplete() {
        setCodeOpen(false);
        onComplete?.();
    }

    return <>
        <EmailDialog open={emailOpen} onComplete={onEmailComplete} onCancel={onEmailCancel}/>
        <CodeDialog open={codeOpen} email={email} onComplete={onCodeComplete} onCancel={onCodeCancel}/>
        <Button onPress={start}>
            <Text>{label}</Text>
        </Button>
    </>
}
