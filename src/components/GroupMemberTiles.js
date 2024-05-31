import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import RoleDropdown from './inputs/RoleDropdown';
import SaveButton from './inputs/buttons/SaveButton';

import { styles } from '../styles/main-styles';

export default function GroupMemberTiles({ groupId, members, role }) {
    const [memberChanges, setMemberChanges] = useState([]);

    const UPDATE_MEMBERS_MUTATION = gql`mutation UpdateGroupMemberRoles($groupId: Int!, $membersToUpdate: [GroupMemberInput]!) {
        updateGroupMemberRoles(groupId: $groupId, membersToUpdate: $membersToUpdate)
    }`;

    const [submitMemberChanges, { loading }] = useMutation(UPDATE_MEMBERS_MUTATION, {
        variables: {
            groupId,
            membersToUpdate: memberChanges
        },
        onCompleted: () => {
            setMemberChanges([]);
        }
    });

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
                    const displayName = `${member.firstName} ${member.lastName} - ${member.username}`;
                    const hasAdminPower = 'owner' === role ||
                        ('admin' === role && ['creator', 'member'].includes(member.role));

                    return <View style={styles.groupMemberCard} key={index}>
                        <View style={styles.groupMember}>
                            <Text variant="bodyLarge">{displayName}</Text>
                        </View>
                        <RoleDropdown
                            hasAdminPower={hasAdminPower}
                            member={member}
                            zIndex={members.length - index}
                            memberChanges={memberChanges}
                            setMemberChanges={setMemberChanges}
                        />
                    </View>
                })}
            </ScrollView>
        </KeyboardAwareScrollView>
    </View>
}
