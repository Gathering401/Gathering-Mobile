import axios from 'axios';

import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { UserContext } from '../tempContext/user-context';

const baseUrl = 'http://localhost:5000/api';

export default function InvitationResponse({status, component, id}) {
    const { token } = useContext(UserContext);
    
    const sendRSVPResponse = async () => {
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