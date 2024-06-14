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

export const LEAVE_GROUP_MUTATION = gql`mutation LeaveGroupMutation($groupId: Int!, $userId: Int!) {
    removeMemberFromGroup(groupId: $groupId, userId: $userId)
}`

export const CREATE_EVENT_MUTATION = gql`mutation CreateEvent($groupId: Int!, $eventData: EventDataInput!) {
    createEvent(groupId: $groupId, eventData: $eventData) {
        groupId
        repeatedEventId
    }
}`;

export const GET_GROUPS_QUERY = gql`query GetGroups {
    groups: getGroups {
        groupName
        groupId
    }
}`;

export const CREATE_GROUP_MUTATION = gql`mutation CreateGroup($groupData: GroupDataInput!) {
    createGroup(groupData: $groupData) {
        groupId
        groupName
        description
        inviteOnly
        owner {
            username
            firstName
            lastName
        }
        location
    }
}`;

export const REMOVE_MEMBER_MUTATION = gql`mutation RemoveMemberFromGroup($groupId: Int!, $userId: Int!) {
    removeMemberFromGroup(groupId: $groupId, userId: $userId)
}`;

export const INVITATION_RESPONSE_QUERY = gql`mutation RespondToInvitation($groupId: Int!, $eventId: Int!, $rsvp: RSVP!) {
    respondToInvitation(groupId: $groupId, eventId: $eventId, rsvp: $rsvp)
}`;

export const GROUPS_AND_UPCOMING_EVENTS_QUERY = gql`query GetGroupsAndUpcomingEvents {
    groups: getGroups {
        groupId
        groupName
        description
    }
    upcoming: getUpcomingEvents {
        eventId
        groupId
        repeatedEventId
        groupName
        eventName
        description
        eventDate
        price
    }
}`

export const REPEATED_EVENT_AND_GROUP_QUERY = gql`query GetRepeatedEventAndGroupInfo($id: Int!, $groupId: Int!) {
    event: getRepeatedEvent(id: $id, groupId: $groupId) {
        eventId
        groupId
        eventName
        description
        eventRepeat
        eventDates
        location
        host {
            userId
            username
        }
        invitedUsers {
            userId
            firstName
            lastName
            username
            rsvp
        }
    }
    group: getGroup(groupId: $groupId) {
        groupId
        groupName
        currentUser {
            userId
            role
        }
    }
}`;
    
export const EVENT_QUERY = gql`query GetCalendarEvents($groupId: Int, $repeat: EventRepeat, $month: Int!, $year: Int!) {
    events: getCalendarEvents(groupId: $groupId, repeat: $repeat, month: $month, year: $year) {
        eventId
        groupId
        eventName
        description
        eventDate
        price
        location
    }
    invitations: getPendingInvitations {
        eventId
        groupId
        eventDate
        eventName
        rsvp
    }
}`;

export const UPDATE_GROUP_MUTATION = gql`mutation UpdateGroup($groupId: Int!, $groupData: GroupDataInput!) {
    updateGroup(groupId: $groupId, groupData: $groupData) {
        groupId
        groupName
        description
        location
        inviteOnly
    }
}`;

export const SEND_RSVP_MUTATION = gql`mutation RespondToInvitation($groupId: Int!, $eventId: Int!, $rsvp: RSVP!) {
    respondToInvitation(groupId: $groupId, eventId: $eventId, rsvp: $rsvp)
}`;

export const DELETE_REPEATED_EVENT_MUTATION = gql`mutation DeleteRepeatedEvent($groupId: Int!, $eventId: Int!) {
    deleteRepeatedEvent(groupId: $groupId, eventId: $eventId)
}`;

export const DELETE_INDIVIDUAL_EVENT_MUTATION = gql`mutation DeleteIndividualEvent($groupId: Int!, $eventId: Int!) {
    deleteIndividualEvent(groupId: $groupId, eventId: $eventId)
}`;

export const LOGIN_MUTATION = gql`mutation LogIn($username: String!, $password: String!) {
    login(username: $username, password: $password) {
        token
        username
    }
}`;
    
export const SIGNUP_MUTATION = gql`mutation SignUp($userData: UserDataInput!) {
    register(userData: $userData) {
        token
    }
}`;

export const AUTHENTICATE_QUERY = gql`query Authenticate($token: String!) {
    authenticate(token: $token)
}`;
