import React from 'react';
import { Text } from 'react-native';

import moment from 'moment';

export const mapToEventCard = (event) => {
    return (
        <>
            <Text>When: {moment(event.start).format('h:mm a')}</Text>
            <Text>Where: {event.location}</Text>
            <Text>Cost: ${event.cost}</Text>
        </>
    )
}