import * as React from 'react';
import { View } from 'react-native';
import {database, lists} from "~/model/database";
import {PlusButton} from "~/components/PlusButton";
import List from "~/model/List";
import {router} from "expo-router";
import {createModelList} from "~/components/ModelList";

type ListListItemProps = {
  list: List,
};

const ListList = createModelList({
  async delete(props: ListListItemProps): Promise<void> {
    await database.write(async () => {
      await props.list.markAsDeleted();
    });
  },
  getListText(props: ListListItemProps): string {
    return props.list.name;
  },
  onPress(props: ListListItemProps): void {
    router.push(`/list/${props.list.id}`)
  },
  getObservables({model}: {model: List}): any {
    return {
      list: model,
    }
  }
})

export default function Screen() {

  async function addList() {
    return database.write(async () => {
      return database.get<List>('lists').create(list => {
        list.name = 'this is another test';
      });
    });
  }

  return (
    <View className='flex-1 bg-secondary'>
      <ListList models={lists} />
      <PlusButton onPress={addList}></PlusButton>
    </View>
  );
}
