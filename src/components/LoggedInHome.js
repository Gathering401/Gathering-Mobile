import axios from 'axios';

import { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import NavBar from './NavBar';
import HorizontalScrollWithTouch from './HorizontalScrollWithTouch';
import Loader from './helpers/Loader';

import { styles } from '../styles/main-styles';

const baseUrl = 'https://1df0-2604-2d80-d288-4100-1c44-c92b-5b26-5132.ngrok-free.app/graphql';

export default function LoggedInHome({navigation}) {
    let [userGroups, setUserGroups] = useState([]);
    let [upcomingEvents, setUpcomingEvents] = useState([]);
    let [waitingForApi, setWaitingForApi] = useState(true);

    useEffect(() => {
        const query = `query GetGroupsAndUpcomingEvents {
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
        }`
        
        async function getAllGroupsAndUpcoming() {
            const token = await SecureStore.getItemAsync('token');
            const { data } = await axios({
                method: 'POST',
                url: baseUrl,
                data: {
                    query
                },
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).catch(err => console.log(err));

            if(data) {
                setUserGroups(data.data.groups);
                setUpcomingEvents(data.data.upcoming);
            }

            setWaitingForApi(false);
        }

        getAllGroupsAndUpcoming();
    }, []);
    
    return waitingForApi
        ? <Loader />
        : (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollWithNav}>
                <Text style={styles.title}>Hello, world!</Text>
                <HorizontalScrollWithTouch
                    scrollTitle="Groups"
                    scrollableItems={userGroups}
                    titleLocation="groupName"
                    mapper="groupCard"
                /><HorizontalScrollWithTouch
                    scrollTitle="Upcoming Events"
                    scrollableItems={upcomingEvents}
                    titleLocation="eventName"
                    mapper="eventCard"
                />
            </ScrollView>
            <NavBar navigation={navigation}/>
        </View>
    )
}