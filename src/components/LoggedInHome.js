import axios from 'axios';

import React, { useContext, useEffect, useState } from 'react';

import { View, Button } from 'react-native';
import { TokenContext } from '../tempContext/token-context';

import HorizontalScrollWithTouch from './HorizontalScrollWithTouch';

const baseUrl = 'http://localhost:5000/api';

export default function LoggedInHome({navigation}) {
    const { token } = useContext(TokenContext);
    
    let [userGroups, setUserGroups] = useState([]);

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

        getAllGroups();
    }, []);
    
    return (
        <View>
            <Button
                title="Calendar"
                onPress={() => navigation.navigate('Calendar')}
            />
            <HorizontalScrollWithTouch
                scrollTitle="Groups"
                scrollableItems={userGroups}
                titleLocation="groupName"
                mapper="groupCard"
            />
            {/* Another horizontal scroller will go here with //Upcoming events// but the endpoint needs to be made for such yet */}
        </View>
    )
}