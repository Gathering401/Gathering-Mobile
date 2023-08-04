import axios from 'axios';

import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import Loader from '../components/helpers/Loader';

import { styles } from '../styles/main-styles';

import { REACT_APP_API_URL } from '@env';

export default function Group({ route: { params: { id } }, navigation }) {
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
        variables: { groupId: id }
    });

    if(loading) {
        return <Loader />
    }

    const { group } = data;
    //             const { data: { data } } = await axios({
    //                 method: 'GET',
    //                 url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${group.location}&key=${REACT_APP_GEO_CODE}`,
    //                 headers: {
    //                     authorization: `Bearer ${token}`,
    //                     'Content-Type': 'application/json'
    //                 }
    //             }).catch(err => console.log(err));
    //         }
    //     }

    return (
        <View style={styles.container}>
            <Text>{group.groupName}</Text>
            <Text>{group.description}</Text>
        </View>
    )
}