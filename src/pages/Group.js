import axios from 'axios';

import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { styles } from '../styles/main-styles';

import { REACT_APP_API_URL } from '@env';

export default function Group({ route: { params: { id } }, navigation }) {
    let [group, setGroup] = useState({});
    let [location, setLocation] = useState(null);

    useEffect(() => {
        const query = `query getGroup($groupId: Int!) {
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
        }`;

        const variables = {
            groupId: id
        }

        async function getGroupAndLocation() {
            // you cannot be serious. this legitimately makes the code work
            console.log('token and stuff', token, query, variables);
            const token = await SecureStore.getItemAsync('token');
            const { data: { data } } = await axios({
                method: 'POST',
                data: {
                    query,
                    variables
                },
                url: `${REACT_APP_API_URL}/graphql`,
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).catch(err => console.log(err));

            console.log('are you sure about that', data);
            if(data) {
                console.log('what are you', data);
                setGroup(data.group);

                const { data: { data } } = await axios({
                    method: 'GET',
                    url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${group.location}&key=${REACT_APP_GEO_CODE}`,
                    headers: {
                        authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }).catch(err => console.log(err));
            }
        }

        getGroupAndLocation();
    });

    return (
        <View style={styles.container}>
            <Text>{group.groupName}</Text>
            <Text>{group.description}</Text>
            <Text>{location}</Text>
        </View>
    )
}