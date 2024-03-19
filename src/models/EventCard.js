import { Text } from 'react-native';
import { Card } from 'react-native-paper';
import { DateTime } from 'luxon';

import { styles } from '../styles/main-styles';

export const EventCard = ({event}) => {
    return (
        <Card style={styles.card}>
            <Card.Title title={event.eventName}/>
            <Card.Content>
                <Text>Date: {DateTime.fromISO(event.eventDate).toFormat('DDD')}</Text>
                <Text>Time: {DateTime.fromISO(event.eventDate).toFormat('t')}</Text>
            <Text>Price: {event.price ? `$${event.price}` : 'Free'}</Text>
            </Card.Content>
        </Card>
    );
}