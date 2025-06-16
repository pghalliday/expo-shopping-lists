import * as React from "react";
import {useRef, useState} from "react";
import {Dialog, DialogContent, DialogTitle} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {Input} from "~/components/ui/input";
import {ActivityIndicator, TextInput, View} from "react-native";
import {addCurrentItem} from "~/model/database";
import List from "~/model/List";
import CurrentItem from "~/model/CurrentItem";

type AddItemDialogProps = {
    open: boolean,
    list: List,
    onCompleteAdd: (currentItem?: CurrentItem) => void,
};

export function AddItemDialog({open, list, onCompleteAdd}: AddItemDialogProps) {
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

    async function addItem() {
        if (inputText !== '') {
            setWorking(true);
            try {
                const currentItem = await addCurrentItem(list.id, inputText);
                onCompleteAdd(currentItem);
            } catch (error: any) {
                setErrorMessage(error);
                input.current!.focus();
            } finally {
                setWorking(false);
            }
        }
    }

    return <Dialog open={open} onOpenChange={() => onCompleteAdd()}>
        <DialogContent>
            <View>
                <DialogTitle>
                    Add Item
                </DialogTitle>
                <ErrorText/>
                <Input
                    ref={input}
                    autoFocus
                    placeholder='New item'
                    onChangeText={onChangeText}
                    submitBehavior='submit'
                    onSubmitEditing={addItem}
                    editable={!working}
                    value={inputText}
                />
                <Button onPress={addItem} disabled={working || inputText === ''}>
                    <Text>Add</Text>
                </Button>
                <ActivityIndicator animating={working}/>
            </View>
        </DialogContent>
    </Dialog>
}
