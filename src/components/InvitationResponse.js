import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function InvitationResponse({status, component}) {
    return (
        <TouchableOpacity
            onPress={() => console.log(newStyles)}>
            {component}
        </TouchableOpacity>
    )
}