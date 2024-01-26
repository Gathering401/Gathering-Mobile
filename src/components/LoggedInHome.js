import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import _ from 'lodash';

import NavBar from './NavBar';
import HorizontalScrollWithTouch from './HorizontalScrollWithTouch';
import Loader from './helpers/Loader';

import { styles } from '../styles/main-styles';

export default function LoggedInHome({navigation}) {
    let [groups, setGroups] = useState([]);
    let [upcoming, setUpcoming] = useState([]);
    
    const { loading } = useQuery(gql`query GetGroupsAndUpcomingEvents {
        groups: getGroups {
            groupId
            groupName
            description
            location
            groupUsers {
                username
                firstName
                lastName
                role
            }
            owner {
                username
                firstName
                lastName
            }
        }
        upcoming: getUpcomingEvents {
            eventId
            groupId
            groupName
            eventName
            description
            eventDate
            price
            food
            location
        }
    }`,
    {
        onCompleted: (data) => {
            console.log(data);
            setGroups(data.groups);
            setUpcoming(data.upcoming);
        },
        onErrors: (error) => {
            console.log('Error', error);
        }
    });

    if(loading) {
        return <Loader />;
    }
    
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollWithNav}>
                <Text style={styles.title}>Hello, world!</Text>
                <HorizontalScrollWithTouch
                    scrollTitle="Groups"
                    scrollableItems={groups}
                    titleLocation="groupName"
                    mapper="group"
                    navigation={navigation}
                /><HorizontalScrollWithTouch
                    scrollTitle="Upcoming Events"
                    scrollableItems={upcoming}
                    titleLocation="eventName"
                    mapper="event"
                    navigation={navigation}
                />
            </ScrollView>
            <NavBar navigation={navigation}/>
        </View>
    )
}