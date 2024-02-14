import { Text } from 'react-native';
import { Card } from 'react-native-paper';
import moment from 'moment-timezone';

import { styles } from '../styles/main-styles';

export const EventCard = ({event}) => {
    return (
        <Card style={styles.card}>
            <Card.Title title={event.eventName}/>
            <Card.Content>
                <Text>{event.eventDate}</Text>
                <Text>{moment(event.eventDate).format('h:mm a')}</Text>
            <Text>Price: ${event.price}</Text>
            </Card.Content>
        </Card>
    )
}