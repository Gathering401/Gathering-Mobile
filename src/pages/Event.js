import axios from 'axios';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { View, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import { DateTime } from 'luxon';

import Loader from '../components/helpers/Loader';
import LocationText from '../components/LocationText';
import { compAddress } from '../service/compAddress';
import { formatLocation } from '../components/helpers/locationFormatter';
import { formatDate } from '../components/helpers/dateFormatter';

import { REACT_APP_GEO_CODE } from '@env';
import { REPEATED_EVENT_AND_GROUP_QUERY } from '../models/Queries';

import { styles } from '../styles/main-styles';

export default function Event({ route: { params: { eventId: id, groupId } }, navigation }) {
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [event, setEvent] = useState({});
    
    const { loading } = useQuery(REPEATED_EVENT_AND_GROUP_QUERY,
    {
        variables: { id, groupId },
        onCompleted: async (response) => {
            setEvent(response.event);

            const locationResponse = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${response.event.location}&key=${REACT_APP_GEO_CODE}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch(err => console.log(err));

            if(locationResponse) {
                const locationData = JSON.parse(JSON.stringify(locationResponse)).data?.results;
                if(locationData) {
                    const compartmenalizedAddress = compAddress(locationData[0].address_components);
                    const location = formatLocation(compartmenalizedAddress, {
                        streetAddress: true,
                        cityState: true
                    });
                    setLocation(location.formattedLocation);
                }
            } else {
                setLocation(null);
            }
            setLocationLoading(false);
        },
        onError: ((error) => {
            console.log('Error: ', JSON.stringify(error, null, 2));
        })
    });

    if(loading || locationLoading || !event.eventName) {
        return <Loader />
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.details}>
                <Text variant="headlineLarge" style={styles.detailsHeader}>{event.eventName}</Text>
                <Text variant="bodyLarge" style={styles.detailsSubHeader}>{event.description}</Text>
                <Text variant="bodyLarge">
                    Happening {formatDate(event.eventRepeat, event.eventDates)}
                </Text>
                {location ? <LocationText location={location} clickable={true}/> : null}
            </View>
        </SafeAreaView>
    )
}