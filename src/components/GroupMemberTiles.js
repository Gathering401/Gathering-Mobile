import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import RoleDropdown from './inputs/RoleDropdown';
import SaveButton from './inputs/buttons/SaveButton';

import { styles } from '../styles/main-styles';
import { REMOVE_MEMBER_MUTATION, UPDATE_MEMBERS_MUTATION, SEND_RSVP_MUTATION } from '../models/Queries';
import RsvpDropdown from './inputs/RsvpDropdown';
import { logError } from './helpers/logError';

export default function GroupMemberTiles({ groupId, eventId, groupName, members, currentUser: { role, userId: currentUserId },
    asSelectors, selectableOnPress, navigation, setOpenNewOwnerModal, asRsvp }) {
    const [memberChanges, setMemberChanges] = useState([]);

    const [submitMemberChanges, { loading: memberChangesLoading }] = useMutation(UPDATE_MEMBERS_MUTATION, {
        variables: {
            groupId,
            membersToUpdate: memberChanges
        },
        onCompleted: () => {
            setMemberChanges([]);
        }
    });

    const [removeMemberMutation, { loading: removeMemberLoading }] = useMutation(REMOVE_MEMBER_MUTATION, {
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

    const [sendRsvp] = useMutation(SEND_RSVP_MUTATION, {
        onError: (error) => {
            logError(error);
        },
        refetchQueries: ['GetRepeatedEventAndGroupInfo']
    });

    return <View style={styles.groupMembersModal}>
        <View style={styles.groupMembersHeader}>
            <Text variant="headlineSmall">Group Members</Text>
            {memberChanges.length > 0
                && <SaveButton onPress={submitMemberChanges} loading={memberChangesLoading} />}
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
                    const showRemoveButton = hasAdminPower && !asSelectors && !asRsvp;

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
                                    logError(error);
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
                            {showRemoveButton &&
                                <Button
                                    onPress={() => removeMember(member.userId, displayName)}
                                    disabled={!hasAdminPower || isCurrentUser}
                                    loading={removeMemberLoading}
                                >
                                    <Icon source="account-remove" color={isCurrentUser ?
                                        "#bdbdbd" :
                                        "#ab0c00"
                                    } size={30} />
                                </Button>
                            }
                            {!asRsvp &&
                                <RoleDropdown
                                    member={member}
                                    memberChanges={memberChanges}
                                    setMemberChanges={setMemberChanges}
                                    disable={!hasAdminPower || isCurrentUser || asSelectors}
                                />
                            }
                            {asRsvp && (hasAdminPower || isCurrentUser) &&
                                <RsvpDropdown
                                    groupId={groupId}
                                    eventId={eventId}
                                    sendRsvp={sendRsvp}
                                    currentRsvp={member.rsvp}
                                    disable={!isCurrentUser}
                                />
                            }
                        </View>
                    </TouchableOpacity>
                })}
            </ScrollView>
        </KeyboardAwareScrollView>
    </View>
}
