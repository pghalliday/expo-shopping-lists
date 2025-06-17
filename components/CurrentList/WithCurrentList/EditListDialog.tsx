import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {Input} from "~/components/ui/input";
import {ActivityIndicator, ScrollView, TextInput} from "react-native";
import {updateList} from "~/model/database";
import List from "~/model/List";

type EditListDialogProps = {
    open: boolean,
    list: List,
    onCompleteEdit: () => void,
};

export function EditListDialog({open, list, onCompleteEdit}: EditListDialogProps) {
    const input = useRef<TextInput>(null);
    const [inputText, setInputText] = useState(list.name);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [working, setWorking] = useState(false);

    useEffect(() => {
        setInputText(list.name);
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

    async function editList() {
        if (inputText !== '') {
            setWorking(true);
            try {
                await updateList(list, inputText);
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
                <DialogTitle>Edit List</DialogTitle>
            </DialogHeader>
            <ScrollView>
                <ErrorText/>
                <Input
                    ref={input}
                    autoFocus
                    placeholder='List name'
                    onChangeText={onChangeText}
                    submitBehavior='submit'
                    onSubmitEditing={editList}
                    editable={!working}
                    value={inputText}
                />
            </ScrollView>
            <DialogFooter>
                <Button onPress={editList} disabled={working || inputText === ''}>
                    <Text>Save</Text>
                </Button>
                <ActivityIndicator animating={working}/>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}
