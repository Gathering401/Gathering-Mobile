import axios from 'axios';

import { TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const baseUrl = 'https://1df0-2604-2d80-d288-4100-1c44-c92b-5b26-5132.ngrok-free.app/graphql';

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