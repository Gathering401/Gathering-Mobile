import { gql, useQuery } from '@apollo/client';
import { View, Text } from 'react-native';
import { Button, Icon } from 'react-native-paper';

import HorizontalScrollWithTouch from './HorizontalScrollWithTouch';
import LogoutButton from './inputs/LogoutButton';
import Loader from './helpers/Loader';

import { styles } from '../styles/main-styles';

export default function LoggedInHome({ navigation }) {
    const { data, errors, loading } = useQuery(gql`query GetGroupsAndUpcomingEvents {
        groups: getGroups {
            groupId
            groupName
            description
        }
        upcoming: getUpcomingEvents {
            eventId
            groupId
            groupName
            eventName
            description
            eventDate
            price
        }
    }`, {
        fetchPolicy: "no-cache",    
    });

    if(loading) {
        return <Loader />;
    }

    if(errors || !data) {
        console.log('Error: ', errors);
        return null;
    }

    const { upcoming, groups } = data;
    
    return (
        <View style={styles.scrollWithNav}>
            <Text style={styles.title}>Welcome</Text>
            <LogoutButton navigation={navigation}/>
            {groups?.length ? <HorizontalScrollWithTouch
                scrollTitle="Your Groups"
                scrollableItems={groups}
                mapper="group"
                navigation={navigation}
            /> : <></>}
            {upcoming?.length ? <HorizontalScrollWithTouch
                scrollTitle="Upcoming Events"
                scrollableItems={upcoming}
                mapper="event"
                navigation={navigation}
            /> : null}
            <Button
                mode='outlined'
                style={{ ...styles.button, marginTop: 15 }}
                onPress={() => navigation.navigate('CalendarTab', {
                    screen: 'Create Event'
                })}>
                <Icon source='plus' color='#042A2B' />New Event
            </Button>
            {!groups?.length ? <Text>Not part of any groups. Join a group to see events here!</Text> : null}
        </View>
    )
}