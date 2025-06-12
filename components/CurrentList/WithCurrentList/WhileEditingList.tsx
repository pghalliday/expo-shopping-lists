import * as React from "react";
import {ActivityIndicator, TextInput, View} from "react-native";
import {useRef, useState} from "react";
import List from "~/model/List";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {updateList} from "~/model/database";

type WhileEditingListProps = {
    list: List,
    onCompleteEdit: () => void,
};

export function WhileEditingList({list, onCompleteEdit}: WhileEditingListProps) {
    const input = useRef<TextInput>(null);
    const [inputText, setInputText] = useState(list.name);
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

    return <View className='flex-1 bg-secondary'>
        <View className='gap-y-4'>
            <ErrorText/>
            <Input
                ref={input}
                autoFocus
                placeholder='List name'
                onChangeText={onChangeText}
                submitBehavior='submit'
                onSubmitEditing={addItem}
                editable={!working}
                value={inputText}
            />
            <Button onPress={addItem} disabled={working || inputText === ''}>
                <Text>Save</Text>
            </Button>
        </View>
        <ActivityIndicator animating={working}/>
    </View>
}
