import { TouchableOpacity } from 'react-native';
import { useMutation } from '@apollo/client';
import { INVITATION_RESPONSE_QUERY } from '../models/Queries';

export default function InvitationResponse({status, component, id}) {
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