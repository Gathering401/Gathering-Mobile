import axios from 'axios';

import { useQuery, gql } from '@apollo/client';
import { View, Text } from 'react-native';
import { useState } from 'react';

import Loader from '../components/helpers/Loader';
import LocationText from '../components/LocationText';
import { compAddress } from '../service/compAddress';

import { REACT_APP_GEO_CODE } from '@env';

import { styles } from '../styles/main-styles';

export default function Event({ route: { params: { id, groupId } }, navigation }) {
    let [location, setLocation] = useState(null);
    
    const { data, errors, loading } = useQuery(gql`query getRepeatedEvent($id: Int!, $groupId: Int!) {
        event: getRepeatedEvent(id: $id, groupId: $groupId) {
            id
            groupId
            eventName
            eventType
            description
            eventDates
            invitedUsers {
                userId
                username
                rsvp
            }
        }
    }`,
    {
        variables: { id, groupId },
        onCompleted: async (response) => {
            const locationResponse = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${response.event.location}&key=${REACT_APP_GEO_CODE}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch(err => console.log(err));

            const locationData = JSON.parse(JSON.stringify(locationResponse)).data?.results;
            if(locationData) {
                const compartmenalizedAddress = compAddress(locationData[0].address_components);
                setLocation(compartmenalizedAddress);
            }
        }
    });

    if(errors) {
        console.log('Error: ', errors);
        return null;
    }

    if(loading) {
        return <Loader />
    }

    const event = data.event;
    
    return (
        <View style={styles.container}>
            <Text>{event.eventName}</Text>
            <Text>{event.eventType}</Text>
            {location && <LocationText location={location} clickable={true}/>}
        </View>
    )
}