import axios from 'axios';

import { TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { REACT_APP_API_URL } from '@env';

export default function InvitationResponse({status, component, id}) {    
    const sendRSVPResponse = async () => {
        const token = await SecureStore.getItemAsync('token');
        await axios({
            method: 'PUT',
            url: `${REACT_APP_API_URL}/graphql`,
            headers: {
                authorization: `Bearer ${token}`
            }
        });
    }
    
    return (
        <TouchableOpacity
            onPress={sendRSVPResponse}>
            {component}
        </TouchableOpacity>
    )
}