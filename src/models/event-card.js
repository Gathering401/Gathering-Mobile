import React from 'react';
import { Text } from 'react-native';

import moment from 'moment-timezone';

export const mapToEventCard = (event) => {
    return (
        <>
            <Text>When: {moment(event.eventDate).format('h:mm a')}</Text>
            <Text>What: {event.description}</Text>
            <Text>Where: {event.location.locationName}</Text>
            <Text>Price: ${event.price}</Text>
        </>
    )
}