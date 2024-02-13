import axios from 'axios';

import { useQuery, gql } from '@apollo/client';
import { View, Text } from 'react-native';
import { useState } from 'react';
import moment from 'moment-timezone';

import Loader from '../components/helpers/Loader';
import LocationText from '../components/LocationText';
import { compAddress } from '../service/compAddress';

import { REACT_APP_GEO_CODE } from '@env';

import { styles } from '../styles/main-styles';

export default function Event({ route: { params: { eventId: id, groupId } }, navigation }) {
    let [location, setLocation] = useState(null);
    let [event, setEvent] = useState({});
    
    const { loading } = useQuery(gql`query getRepeatedEvent($id: Int!, $groupId: Int!) {
        event: getIndividualEvent(id: $id, groupId: $groupId) {
            eventId
            groupId
            eventName
            description
            eventDate
            location
            price
            food
            invitedUsers {
                userId
                username
                rsvp
            }
            groupName
        }
    }`,
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

            const locationData = JSON.parse(JSON.stringify(locationResponse)).data?.results;
            if(locationData) {
                const compartmenalizedAddress = compAddress(locationData[0].address_components);

                compartmenalizedAddress.lat = locationData[0].geometry.location.lat;
                compartmenalizedAddress.lng = locationData[0].geometry.location.lng;
                
                setLocation(compartmenalizedAddress);
            }
        },
        onError: ((error) => {
            console.log('Error: ', error);
        })
    });

    if(loading || !event.eventName) {
        return <Loader />
    }
    
    return (
        <View style={styles.container}>
            <Text>{event.eventName}</Text>
            <Text>{event.description}</Text>
            <Text>{moment(event.eventDate, 'MM/DD/YYYY h:mma Z').format('h:mma M/DD/YY')}</Text>
            {location && <LocationText location={location} clickable={true}/>}
        </View>
    )
}