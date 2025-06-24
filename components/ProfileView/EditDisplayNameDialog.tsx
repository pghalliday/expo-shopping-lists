import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {Input} from "~/components/ui/input";
import {ActivityIndicator, ScrollView, TextInput} from "react-native";
import Profile from "~/model/Profile";
import {useApi} from "~/lib/providers/ApiProvider";

type EditDisplayNameDialogProps = {
    open: boolean,
    profile: Profile,
    onCompleteEdit: () => void,
};

export function EditDisplayNameDialog({open, profile, onCompleteEdit}: EditDisplayNameDialogProps) {
    const api = useApi();
    const input = useRef<TextInput>(null);
    const [inputText, setInputText] = useState(profile.displayName);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [working, setWorking] = useState(false);

    useEffect(() => {
        setInputText(profile.displayName);
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

    async function setDisplayName() {
        if (inputText !== '') {
            setWorking(true);
            try {
                await api!.updateProfileDisplayName(profile, inputText);
                onCompleteEdit();
            } catch (error: any) {
                setErrorMessage(error);
                input.current!.focus();
            } finally {
                setWorking(false);
            }
        }
    }

    return <Dialog open={open} onOpenChange={() => onCompleteEdit()}>
        <DialogContent className='min-w-full mt-10'>
            <DialogHeader>
                <DialogTitle>Change Display Name</DialogTitle>
            </DialogHeader>
            <ScrollView>
                <ErrorText/>
                <Input
                    ref={input}
                    autoFocus
                    placeholder='Your Name'
                    autoComplete='off'
                    autoCapitalize='words'
                    autoCorrect={false}
                    keyboardType='default'
                    onChangeText={onChangeText}
                    submitBehavior='submit'
                    onSubmitEditing={setDisplayName}
                    editable={!working}
                    value={inputText}
                />
            </ScrollView>
            <DialogFooter>
                <Button onPress={setDisplayName} disabled={working || inputText === ''}>
                    <Text>Save</Text>
                </Button>
                <ActivityIndicator animating={working}/>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}
