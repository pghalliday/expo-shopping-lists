import {Label} from "~/components/ui/label";
import * as React from "react";
import {ThemeSetting, useThemeSetting} from "~/lib/Root/ThemeSettingProvider";
import {Option, Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {View} from "react-native";

const LABELS: Record<ThemeSetting, string> = {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
}

type ThemeItemProps = {
    themeSetting: ThemeSetting,
};

function ThemeItem({themeSetting}: ThemeItemProps) {
    return (
        <SelectItem label={LABELS[themeSetting]} value={themeSetting}>
            {LABELS[themeSetting]}
        </SelectItem>
    );
}

export function ThemeSelect() {
    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };
    const {themeSetting, setThemeSetting} = useThemeSetting();

    const onValueChange = (option: Option) => {
        setThemeSetting(option!.value as ThemeSetting);
    };

    return (
        <View className='flex-row items-center gap-2'>
            <View className='grow-0'>
                <Label nativeID='theme'>Theme</Label>
            </View>
            <View className='grow'>
                <Select value={{value: themeSetting, label: LABELS[themeSetting]}} onValueChange={onValueChange}>
                    <SelectTrigger>
                        <SelectValue
                            className='text-foreground text-sm native:text-lg'
                            placeholder='Select a theme'
                        />
                    </SelectTrigger>
                    <SelectContent insets={contentInsets}>
                        <ThemeItem themeSetting='system'/>
                        <ThemeItem themeSetting='light'/>
                        <ThemeItem themeSetting='dark'/>
                    </SelectContent>
                </Select>
            </View>
        </View>
    );
}
