import axios from 'axios';

import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { TokenContext } from '../tempContext/token-context';

const baseUrl = 'http://localhost:4000/graphql';

export default function InvitationResponse({status, component, id}) {
    const { token } = useContext(TokenContext);
    
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