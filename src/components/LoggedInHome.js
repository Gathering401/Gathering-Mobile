import axios from 'axios';

import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import { UserContext } from '../tempContext/user-context';

import NavBar from './NavBar';
import HorizontalScrollWithTouch from './HorizontalScrollWithTouch';

const baseUrl = 'http://localhost:5000/api';

export default function LoggedInHome({navigation}) {
    const { token, preferences } = useContext(UserContext);
    
    let [userGroups, setUserGroups] = useState([]);
    let [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        async function getAllGroups() {
            const response = await axios({
                method: 'GET',
                url: `${baseUrl}/Group`,
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            if(response.data) {
                setUserGroups(response.data)
            }
        }

        async function getAllUpcoming() {
            const response = await axios({
                method: 'GET',
                url: `${baseUrl}/Upcoming/${preferences.daysOut}`,
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            if(response.data) {
                setUpcomingEvents(response.data);
            }
        }

        getAllGroups();
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
                mapper="upcomingEventCard"
            />
            <NavBar navigation={navigation}/>
        </View>
    )
}