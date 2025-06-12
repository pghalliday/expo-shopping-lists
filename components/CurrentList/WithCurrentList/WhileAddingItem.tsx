import * as React from "react";
import {ActivityIndicator, TextInput, View} from "react-native";
import {useRef, useState} from "react";
import List from "~/model/List";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {addCurrentItem} from "~/model/database";
import CurrentItem from "~/model/CurrentItem";

type WhileAddingItemProps = {
    list: List,
    onCompleteAdd: (currentItem: CurrentItem) => void,
};

export function WhileAddingItem({list, onCompleteAdd}: WhileAddingItemProps) {
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
        </View>
        <ActivityIndicator animating={working}/>
    </View>
}
