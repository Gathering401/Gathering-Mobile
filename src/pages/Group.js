import axios from 'axios';

import { useQuery, gql } from '@apollo/client';
import { View, Text } from 'react-native';
import { useState } from 'react';

import Loader from '../components/helpers/Loader';
import { compAddress } from '../service/compAddress';

import { REACT_APP_GEO_CODE } from '@env';

import { styles } from '../styles/main-styles';

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

            const locationData = JSON.parse(JSON.stringify(locationResponse)).data?.results;
            if(locationData) {
                const compartmenalizedAddress = compAddress(locationData[0].address_components);
                setLocation(`${compartmenalizedAddress.city}, ${compartmenalizedAddress.state}`);
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
            {location && <Text>{location}</Text>}
        </View>
    )
}