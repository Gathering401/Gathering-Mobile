import axios from 'axios';

import { TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { TokenContext } from '../tempContext/token-context';

const baseUrl = 'http://localhost:4000/graphql';

export default function InvitationResponse({status, component, id}) {    
    const sendRSVPResponse = async () => {
        const token = await SecureStore.getItemAsync('token');
        await axios({
            method: 'PUT',
            url: `${baseUrl}/Calendar/Event/${id}/Invitation/${status}`,
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