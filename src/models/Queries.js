import { gql } from '@apollo/client';

export const GROUP_QUERY = gql`query GetGroup($groupId: Int!) {
    group: getGroup(groupId: $groupId) {
        groupId
        groupName
        description
        inviteOnly
        groupMembers {
            userId
            username
            firstName
            lastName
            role
        }
        joinRequests {
            username
            firstName
            lastName
            status
        }
        owner {
            username
            firstName
            lastName
        }
        location
        currentUser {
            userId
            role
        }
        upcoming: upcomingEvents {
            eventId
            groupId
            groupName
            eventName
            description
            eventDate
            price
        }
    }
}`;

export const UPDATE_MEMBERS_MUTATION = gql`mutation UpdateGroupMemberRoles($groupId: Int!, $membersToUpdate: [GroupMemberInput]!) {
    updateGroupMemberRoles(groupId: $groupId, membersToUpdate: $membersToUpdate)
}`;

export const UPDATE_OWNER_AND_LEAVE_MUTATION = gql`mutation UpdateOwnerAndLeaveGroup($groupId: Int!, $membersToUpdate: [GroupMemberInput]!, $userId: Int!) {
    updateGroupMemberRoles(groupId: $groupId, membersToUpdate: $membersToUpdate)
    removeMemberFromGroup(groupId: $groupId, userId: $userId)
}`;
