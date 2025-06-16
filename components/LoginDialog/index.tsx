import * as React from "react";
import {useState} from "react";
import {WhileWaitingForEmail} from "~/components/LoginDialog/WhileWaitingForEmail";
import {WhileWaitingForCode} from "~/components/LoginDialog/WhileWaitingForCode";
import {Dialog, DialogTrigger} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";

type LoginDialogProps = {
    buttonText: string,
    onComplete: () => void,
};

export function LoginDialog({buttonText, onComplete}: LoginDialogProps) {
    const [open, setOpen] = useState(false);

    function onOpenChange(value: boolean) {
        setOpen(value);
    }

    const OpenDialogContent = () => {
        const [email, setEmail] = useState('');
        const [waitingForCode, setWaitingForCode] = useState(false);

        function onCompleteCode() {
            onComplete();
        }

        function onCompleteEmail(email: string) {
            setEmail(email);
            setWaitingForCode(true);
        }

        if (waitingForCode) {
            return <WhileWaitingForCode email={email} onCompleteCode={onCompleteCode}/>;
        }
        return <WhileWaitingForEmail email={email} onCompleteEmail={onCompleteEmail}/>;
    }

    const DialogContent = () => {
        if (open) {
            return <OpenDialogContent/>
        }
        return null;
    }

    return <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
            <Button>
                <Text>{buttonText}</Text>
            </Button>
        </DialogTrigger>
        <DialogContent/>
    </Dialog>
}
