import axios from 'axios';

import { useQuery, gql } from '@apollo/client';
import { View, Text } from 'react-native';
import { useState } from 'react';
import moment from 'moment-timezone';

import Loader from '../components/helpers/Loader';
import LocationText from '../components/LocationText';
import { compAddress } from '../service/compAddress';
import { formatLocation } from '../components/helpers/locationFormatter';

import { REACT_APP_GEO_CODE } from '@env';

import { styles } from '../styles/main-styles';

export default function Event({ route: { params: { eventId: id, groupId, repeated } }, navigation }) {
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [event, setEvent] = useState({});
    
    const { loading } = useQuery(gql`query getRepeatedEventAndGroupInfo($id: Int!, $groupId: Int!) {
        event: ${repeated ? 'getRepeatedEvent' : 'getIndividualEvent'}(id: $id, groupId: $groupId) {
            eventId
            groupId
            eventName
            description${repeated ? `
            eventRepeat` : ''}
            eventDate${repeated ? 's' : ''}
            location
            invitedUsers {
                userId
                username
                rsvp
            }
        }
        group: getGroup(groupId: $groupId) {
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
        <View style={styles.container}>
            <Text>{event.eventName}</Text>
            <Text>{event.description}</Text>
            <Text>{moment(event.eventDate, 'MM/DD/YYYY h:mma Z').format('h:mma M/DD/YY')}</Text>
            {location ? <LocationText location={location} clickable={true}/> : null}
        </View>
    )
}