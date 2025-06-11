import * as React from 'react';
import {Tabs, useLocalSearchParams, useNavigation} from "expo-router";
import {useEffect} from "react";
import {database} from "~/model/database";
import List from "~/model/List";
import {SettingsButton} from "~/components/SettingsButton";

export default function TabLayout() {
  const navigation = useNavigation();
  const { id }: { id: string } = useLocalSearchParams();

  useEffect(() => {
    const findList = async () => {
      const list = await database.get<List>('lists').find(id)
      navigation.setOptions({ title: list.name })
    }
    navigation.setOptions({ title: 'Loading...' })
    findList().catch(console.error)
  })

  return (
      <Tabs
          screenOptions={{
              headerShown: false,
          }}
      >
        <Tabs.Screen
            name='index'
            options={{
              title: 'Current Items',
              href: {
                pathname: '/list/[id]',
                params: {
                  id: id,
                }
              }
            }}
        />
        <Tabs.Screen
            name='sources'
            options={{
              title: 'Sources',
              href: {
                pathname: '/list/[id]/sources',
                params: {
                  id: id,
                }
              }
            }}
        />
        <Tabs.Screen
            name='items'
            options={{
              title: 'Items',
              href: {
                pathname: '/list/[id]/items',
                params: {
                  id: id,
                }
              }
            }}
        />
        <Tabs.Screen
            name='previousItems'
            options={{
              title: 'Previous Items',
              href: {
                pathname: '/list/[id]/previousItems',
                params: {
                  id: id,
                }
              }
            }}
        />
      </Tabs>
  );
}
