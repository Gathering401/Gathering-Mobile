import axios from 'axios';

import { useQuery, gql } from '@apollo/client';
import { View, Text } from 'react-native';
import { useState } from 'react';
import { Button, Icon } from 'react-native-paper';

import Loader from '../components/helpers/Loader';
import LocationText from '../components/LocationText';
import { compAddress } from '../service/compAddress';
import { formatLocation } from '../components/helpers/locationFormatter';

import { REACT_APP_GEO_CODE } from '@env';

import { styles } from '../styles/main-styles';

export default function Group({ route: { params: { id } }, navigation }) {
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    
    const { data, errors, loading } = useQuery(gql`query getGroup($groupId: Int!) {
        group: getGroup(groupId: $groupId) {
            groupName
            description
            inviteOnly
            groupUsers {
                username
                firstName
                lastName
            }
            joinRequests {
                username
                firstName
                lastName
                status
            }
            owner {
                username
                firstName
                lastName
            }
            location
        }
    }`,
    {
        variables: { groupId: id },
        onCompleted: async ({ group }) => {
            const locationResponse = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${group.location}&key=${REACT_APP_GEO_CODE}`,
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
        }
    });

    if(errors) {
        console.log('Error: ', errors);
        return null;
    }

    if(loading || locationLoading || !data.group.groupName) {
        return <Loader />
    }

    return (
        <View style={styles.container}>
            <Text>{data.group.groupName}</Text>
            <Text>{data.group.description}</Text>
            {location ? <LocationText location={location} clickable={true}/> : null}
            <Button
                mode='outlined'
                style={styles.button}
                onPress={() => navigation.navigate('CalendarTab', {
                    screen: 'Create Event',
                    params: {
                        groupId: id
                    }
                })}>
                <Icon source='plus' color='#042A2B' />New Event
            </Button>
        </View>
    )
}