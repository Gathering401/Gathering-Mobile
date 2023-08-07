import { View, Text } from 'react-native';

import moment from 'moment-timezone';

export const MapToEventCard = ({event}) => {
    return (
        <View>
            <Text>When: {moment(event.eventDate).format('h:mm a')}</Text>
            <Text>What: {event.description}</Text>
            {/* <Text>Where: {event.location.locationName}</Text> */}
            <Text>Price: ${event.price}</Text>
        </View>
    )
}