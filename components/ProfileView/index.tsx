import * as React from "react";
import Profile from "~/model/Profile";
import {withObservables} from "@nozbe/watermelondb/react";
import {ScrollView} from "react-native";
import {Label} from "~/components/ui/label";
import {Text} from "~/components/ui/text";
import {Button} from "~/components/ui/button";
import {useState} from "react";
import {EditDisplayNameDialog} from "~/components/ProfileView/EditDisplayNameDialog";

export type ProfileViewProps = {
    profile: Profile;
}

function _ProfileView({profile}: ProfileViewProps) {
    const [editingDisplayName, setEditingDisplayName] = useState(false);

    function startEditDisplayName() {
        setEditingDisplayName(true);
    }

    function completeEditDisplayName() {
        setEditingDisplayName(false);
    }

    return <ScrollView>
        <Label nativeID='displayName'>Display name</Label>
        <Text>{profile.displayName}</Text>
        <Button onPress={startEditDisplayName}><Text>Edit</Text></Button>
        <EditDisplayNameDialog open={editingDisplayName} profile={profile} onCompleteEdit={completeEditDisplayName}/>
    </ScrollView>
}

const enhance = withObservables(['profile'], ({profile}) => ({
   profile,
}))
export const ProfileView = enhance(_ProfileView)
