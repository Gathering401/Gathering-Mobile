import { TouchableOpacity } from 'react-native';
import { gql, useMutation } from '@apollo/client';

export default function InvitationResponse({status, component, id}) {
    const INVITATION_RESPONSE_QUERY = gql`mutation RespondToInvitation($groupId: Int!, $eventId: Int!, $rsvp: RSVP!) {
        respondToInvitation(groupId: $groupId, eventId: $eventId, rsvp: $rsvp)
    }`;
    
    const [respondToInvitation, { errors, loading }] = useMutation(INVITATION_RESPONSE_QUERY);

    if(errors) {
        console.log('Error: ', errors);
        return null;
    }

    if(loading) {
        return <Loader />
    }
    
    return (
        <TouchableOpacity
            onPress={() => respondToInvitation({
                variables: {
                    groupId,
                    eventId,
                    status
                }, onCompleted: async () => {
                    navigation.navigate('HomeTab');
                }, onError: (error) => {
                    console.log('Error: ', JSON.stringify(error, null, 2));
                }
            })}>
            {component}
        </TouchableOpacity>
    )
}