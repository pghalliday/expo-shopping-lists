import * as React from "react";
import {useRef, useState} from "react";
import {Dialog, DialogContent, DialogTitle} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {Input} from "~/components/ui/input";
import {ActivityIndicator, TextInput} from "react-native";
import {updateList} from "~/model/database";
import List from "~/model/List";

type EditListDialogProps = {
    open: boolean,
    list: List,
    onCompleteEdit: () => void,
};

export function EditListDialog({open, list, onCompleteEdit}: EditListDialogProps) {
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
        <DialogContent>
            <DialogTitle>
                Edit List
            </DialogTitle>
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
            <Button onPress={editList} disabled={working || inputText === ''}>
                <Text>Save</Text>
            </Button>
            <ActivityIndicator animating={working}/>
        </DialogContent>
    </Dialog>
}
