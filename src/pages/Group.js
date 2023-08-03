import axios from 'axios';

import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { styles } from '../styles/main-styles';

import { REACT_APP_API_URL } from '@env';

export default function Group({ route: { params: { id } }, navigation }) {
    let [group, setGroup] = useState({});

    useEffect(() => {
        const query = `query GetGroup($groupId: Int!) {
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

        async function getGroup() {
            // you not bein serious
            const token = await SecureStore.getItemAsync('token');
            const { data } = await axios({
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

            if(data) {
                console.log('group', data);
            }
        }

        getGroup();
    });

    return (
        <View>
            <Text>In progress</Text>
        </View>
    )
}