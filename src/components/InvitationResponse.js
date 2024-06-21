import { TouchableOpacity } from 'react-native';
import { useMutation } from '@apollo/client';
import { INVITATION_RESPONSE_QUERY } from '../models/Queries';
import { logError } from './helpers/logError';

export default function InvitationResponse({status, component, id}) {
    const [respondToInvitation, { errors, loading }] = useMutation(INVITATION_RESPONSE_QUERY);

    if(errors) {
        logError(errors);
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
                    logError(error);
                }
            })}>
            {component}
        </TouchableOpacity>
    )
}