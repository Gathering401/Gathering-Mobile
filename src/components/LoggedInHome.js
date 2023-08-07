import { gql, useQuery } from '@apollo/client';
import { View, ScrollView, Text } from 'react-native';

import NavBar from './NavBar';
import HorizontalScrollWithTouch from './HorizontalScrollWithTouch';
import Loader from './helpers/Loader';

import { styles } from '../styles/main-styles';

export default function LoggedInHome({navigation}) {
    const { data, errors, loading } = useQuery(gql`query GetGroupsAndUpcomingEvents {
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
    }`);

    if(loading) {
        return <Loader />;
    }

    if(errors) {
        console.log('Error', errors);
        return null;
    }

    const { upcoming, groups } = data;
    
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