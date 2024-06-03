import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import RoleDropdown from './inputs/RoleDropdown';
import SaveButton from './inputs/buttons/SaveButton';

import { styles } from '../styles/main-styles';
import { REMOVE_MEMBER_MUTATION, UPDATE_MEMBERS_MUTATION } from '../models/Queries';

export default function GroupMemberTiles({ groupId, groupName, members, currentUser: { role, userId: currentUserId }, asSelectors, selectableOnPress, navigation, setOpenNewOwnerModal }) {
    const [memberChanges, setMemberChanges] = useState([]);

    const [submitMemberChanges, { loading }] = useMutation(UPDATE_MEMBERS_MUTATION, {
        variables: {
            groupId,
            membersToUpdate: memberChanges
        },
        onCompleted: () => {
            setMemberChanges([]);
        }
    });

    const [removeMemberMutation, { removeMemberLoading }] = useMutation(REMOVE_MEMBER_MUTATION, {
        refetchQueries: ['GetGroup']
    });

    const removeMember = (userId, displayName) => {
        Alert.alert('Are you sure?', `This will remove ${displayName} from ${groupName}.`, [
            {
                text: 'Nevermind',
                style: 'cancel'
            },
            {
                text: `I'm sure`,
                onPress: () => {
                    removeMemberMutation({
                        variables: {
                            groupId,
                            userId
                        }
                    });
                }
            }
        ]);
    }

    return <View style={styles.groupMembersModal}>
        <View style={styles.groupMembersHeader}>
            <Text variant="headlineSmall">Group Members</Text>
            {memberChanges.length > 0
                && <SaveButton onPress={submitMemberChanges} loading={loading} />}
        </View>
        <KeyboardAwareScrollView
            contentContainerStyle={styles.listModal}
        >
            <ScrollView>
                {members.map((member, index) => {
                    const isCurrentUser = currentUserId === member.userId;
                    const displayName = `${member.firstName} ${member.lastName} - ${member.username}${isCurrentUser ? ' (you)' : ''}`;
                    const hasAdminPower = 'owner' === role ||
                        ('admin' === role && ['creator', 'member'].includes(member.role));

                    return <TouchableOpacity
                        key={index}
                        disabled={!asSelectors || isCurrentUser}
                        onPress={() => {
                            selectableOnPress({
                                variables: {
                                    membersToUpdate: [{
                                        userId: member.userId,
                                        role: 'owner'
                                    }],
                                    groupId,
                                    userId: currentUserId
                                },
                                onError: (error) => {
                                    console.log(JSON.stringify(error, null, 2))
                                },
                                onCompleted: () => {
                                    setOpenNewOwnerModal(false);
                                    navigation.navigate('HomeTab', {
                                        screen: 'Home'
                                    });
                                },
                                refetchQueries: ['GetGroupsAndUpcomingEvents']
                            });
                        }}
                    >
                        <View style={styles.groupMemberCard}>
                            <View style={{...styles.groupMember, ...(asSelectors ? {flexBasis: '80%'} : {})}}>
                                <Text variant="bodyLarge">{displayName}</Text>
                            </View>
                            {hasAdminPower && !asSelectors &&
                                <Button
                                    onPress={() => removeMember(member.userId, displayName)}
                                    disabled={!hasAdminPower || isCurrentUser}
                                >
                                    <Icon source="account-remove" color={isCurrentUser ?
                                        "#bdbdbd" :
                                        "#ab0c00"
                                    } size={30} />
                                </Button>
                            }
                            <RoleDropdown
                                hasAdminPower={hasAdminPower}
                                member={member}
                                zIndex={members.length - index}
                                memberChanges={memberChanges}
                                setMemberChanges={setMemberChanges}
                                disable={!hasAdminPower || isCurrentUser || asSelectors}
                            />
                        </View>
                    </TouchableOpacity>
                })}
            </ScrollView>
        </KeyboardAwareScrollView>
    </View>
}
