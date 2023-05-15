import axios from 'axios';

import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import { TokenContext } from '../tempContext/token-context';

import NavBar from './NavBar';
import HorizontalScrollWithTouch from './HorizontalScrollWithTouch';

const baseUrl = 'http://localhost:4000/graphql';

export default function LoggedInHome({navigation}) {
    const { token } = useContext(TokenContext);
    
    let [userGroups, setUserGroups] = useState([]);
    let [upcomingEvents, setUpcomingEvents] = useState([]);

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
            const { data: { data } } = await axios({
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
                setUserGroups(data.groups);
                setUpcomingEvents(data.upcoming);
            }
        }

        getAllGroupsAndUpcoming();
    }, []);
    
    return (
        <View>
            <HorizontalScrollWithTouch
                scrollTitle="Groups"
                scrollableItems={userGroups}
                titleLocation="groupName"
                mapper="groupCard"
            />
            <HorizontalScrollWithTouch
                scrollTitle="Upcoming Events"
                scrollableItems={upcomingEvents}
                titleLocation="eventName"
                mapper="eventCard"
            />
            <NavBar navigation={navigation}/>
        </View>
    )
}