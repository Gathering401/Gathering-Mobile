import axios from 'axios';

import React from 'react';
import { TouchableOpacity } from 'react-native';

const baseUrl = 'http://localhost:5000/api';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdCIsIkFzcE5ldC5JZGVudGl0eS5TZWN1cml0eVN0YW1wIjoiRkNCTFQ2WlUyNUdXR01LUFFaUDYzMktQWlhKT0tTWVUiLCJleHAiOjE2NzE3NDM0MjJ9.bNr9tV0YTR1EaO-SOnI-LdS0Mj33RYvp0Q8f0fk83WM';

export default function InvitationResponse({status, component, id}) {
    const sendRSVPResponse = async () => {
        const response = await axios({
            method: 'PUT',
            url: `${baseUrl}/Calendar/Event/${id}/Invitation/${status}`,
            headers: {
                authorization: `Bearer ${authToken}`
            }
        });
        
        console.log('response: ', response);
    }
    
    return (
        <TouchableOpacity
            onPress={sendRSVPResponse}>
            {component}
        </TouchableOpacity>
    )
}