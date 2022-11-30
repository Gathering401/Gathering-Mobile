import React from 'react';
import { Text } from 'react-native';

export const mapToGroupCard = (group) => {
    return (
        <>
            <Text>{group.description}</Text>
        </>
    )
}
