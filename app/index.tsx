import * as React from 'react';
import { View } from 'react-native';
import ListList from "~/components/ListList";
import {database, lists} from "~/model/database";
import {PlusButton} from "~/components/PlusButton";
import List from "~/model/List";

export default function Screen() {

  async function addList() {
    return database.write(async () => {
      return database.get<List>('lists').create(list => {
        list.name = 'this is another test';
      });
    });
  }

  return (
    <View className='flex-1 bg-background'>
      <ListList lists={lists} />
      <PlusButton onPress={addList}></PlusButton>
    </View>
  );
}
