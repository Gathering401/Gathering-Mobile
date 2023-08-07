import axios from 'axios';

import { useQuery, gql } from '@apollo/client';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import Loader from '../components/helpers/Loader';

import { REACT_APP_GEO_CODE } from '@env';

import { styles } from '../styles/main-styles';
import { useEffect, useState } from 'react';

export default function Group({ route: { params: { id } }, navigation }) {
    let [location, setLocation] = useState(null);
    
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
        onCompleted: async (response) => {
            const locationResponse = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${response.group.location}&key=${REACT_APP_GEO_CODE}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch(err => console.log(err));

            const locationData = JSON.parse(JSON.stringify(locationResponse)).data.results;
            if(locationData) {
                const addressComp = locationData[0].address_components;
                const city = addressComp.find(ac => ac.types[0] === 'locality').long_name;
                const state = addressComp.find(ac => ac.types[0] === 'administrative_area_level_1').short_name;
                // going to need a helper for this ^^ to make it more advanced and extend to worldwide, giving more accurate and helpful location information. This works for now though.
                setLocation(`${city}, ${state}`);
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

    const group = data.group;
    
    return (
        <View style={styles.container}>
            <Text>{group.groupName}</Text>
            <Text>{group.description}</Text>
            <Text>{location}</Text>
        </View>
    )
}