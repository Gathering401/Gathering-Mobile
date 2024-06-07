import { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import LocationInput from './inputs/LocationInput';

import { styles } from '../styles/main-styles';
import { useMutation } from '@apollo/client';
import { UPDATE_GROUP_MUTATION } from '../models/Queries';

export default function GroupUpdate({ route: { params: { group, location } }, navigation }) {
    const [groupName, setGroupName] = useState(group.groupName);
    const [description, setDescription] = useState(group.description);
    const [newLocation, setNewLocation] = useState(location);
    const [inviteOnly, setInviteOnly] = useState(group.inviteOnly);

    const [updateGroup, { loading }] = useMutation(UPDATE_GROUP_MUTATION, {
        variables: {
            groupId: group.groupId,
            groupData: {
                groupName,
                description,
                location: newLocation,
                inviteOnly
            }
        },
        onCompleted: () => {
            navigation.navigate('GroupsTab', {
                screen: 'Group',
                params: {
                    id: group.groupId
                }
            })
        },
        onError: (error) => {
            console.log('Error: ', JSON.stringify(error, null, 2));
        },
        awaitRefetchQueries: true,
        refetchQueries: ['GetGroup', 'GetGroups', 'GetGroupsAndUpcomingEvents']
    })

    const setLocationValue = (_, placeId) => {
        setNewLocation(placeId);
    }

    return <SafeAreaView style={styles.container} onStartShouldSetResponder={false}>
        <KeyboardAwareScrollView
            style={{ width: '100%' }}
            contentContainerStyle={styles.form}
        >
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label='Group Name'
                outlineColor='rgb(190, 190, 190)'
                required={false}
                secureTextEntry={false}
                autoCapitalize={true}
                spellCheck={false}
                onChangeText={setGroupName}
                multiline={false}
                value={groupName}
            />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label='Description'
                outlineColor='rgb(190, 190, 190)'
                required={false}
                secureTextEntry={false}
                autoCapitalize={true}
                spellCheck={false}
                onChangeText={setDescription}
                multiline={false}
                value={description}
            />
            <LocationInput
                fieldName={''}
                value={newLocation}
                setFieldValue={setLocationValue}
                handleBlur={() => {}}
            />
            <Checkbox.Item
                label='Invite Only?'
                style={styles.checkbox}
                status={inviteOnly ? 'checked' : 'unchecked'}
                onPress={() => {
                    setInviteOnly(!inviteOnly);
                }}
            />
            <Button
                mode='outlined'
                style={styles.button}
                onPress={updateGroup}
                loading={loading}
            >Save Changes</Button>
        </KeyboardAwareScrollView>
    </SafeAreaView>
}