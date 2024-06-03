import axios from 'axios';

import { useQuery, gql } from '@apollo/client';
import { View, Text } from 'react-native';
import { useState } from 'react';
import { DateTime } from 'luxon';

import Loader from '../components/helpers/Loader';
import LocationText from '../components/LocationText';
import { compAddress } from '../service/compAddress';
import { formatLocation } from '../components/helpers/locationFormatter';

import { REACT_APP_GEO_CODE } from '@env';

import { styles } from '../styles/main-styles';
import { REPEATED_EVENT_AND_GROUP_QUERY } from '../models/Queries';

export default function Event({ route: { params: { eventId: id, groupId, repeated } }, navigation }) {
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

    const displayDate = repeated !== 'never'
        ? <>
            <Text>Upcoming Dates</Text>
            <Text>{event.eventDates.slice(0, 4).map(d => DateTime.fromISO(d).toFormat('LLLL d')).join(', ')}</Text>
        </>
        : <Text>{DateTime.fromISO(event.eventDate).toFormat('fff')}</Text>

    return (
        <View style={styles.container}>
            <Text>{event.eventName}</Text>
            <Text>{event.description}</Text>
            {displayDate}
            {location ? <LocationText location={location} clickable={true}/> : null}
        </View>
    )
}