import { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Menu, Icon } from 'react-native-paper';

import { styles } from '../styles/main-styles';

export default function HeaderMenu({ group, location, currentUser, setGroupMembersOpen, setNewOwnerOpen, navigation }) {
    const role = currentUser.role;
    const isOwner = role === 'owner';
    const isAdmin = isOwner || role === 'admin';
    const isCreator = isAdmin || role === 'creator';

    const [menuOpen, setMenuOpen] = useState(false);

    const openMembersModal = () => {
        setMenuOpen(false);
        setGroupMembersOpen(true);
    }

    const openGroupSettings = () => {
        setMenuOpen(false);
        console.log('hello')
        navigation.navigate('GroupsTab', {
            screen: 'Update Group',
            params: {
                group,
                location
            }
        })
    }

    const leaveGroup = () => {
        setMenuOpen(false);
        if(isOwner) {
            Alert.alert(`Leave ${group.groupName}?`, `As the owner, you'll have to pick a new owner before leaving.`, [
                {
                    text: 'Nevermind',
                    style: 'cancel'
                },
                {
                    text: `Yes, leave group`,
                    onPress: () => {
                        setNewOwnerOpen(true);
                    }
                }
            ]);
        }
    }

    return (
        <View style={styles.hamburgerWrapper}>
            <Menu
                visible={menuOpen}
                onDismiss={() => setMenuOpen(false)}
                anchorPosition='bottom'
                anchor={
                    <Button onPress={() => setMenuOpen(true)}><Icon source='menu' size={30} color='#5EB1BF' /></Button>
                }
                style={styles.hamburger}
            >
                {isAdmin &&
                    <Menu.Item
                        onPress={openMembersModal}
                        title="Group Members"
                    />
                }
                {isAdmin &&
                    <Menu.Item
                        onPress={openGroupSettings}
                        title="Group Settings"
                    />
                }
                <Menu.Item
                    onPress={leaveGroup}
                    title="Leave Group"
                    titleStyle={{ color: 'red' }}
                />
            </Menu>
        </View>
    )
}