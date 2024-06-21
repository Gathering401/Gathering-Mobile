import { useQuery } from '@apollo/client';
import { View, Text } from 'react-native';
import { Button, Icon } from 'react-native-paper';

import HorizontalScrollWithTouch from './HorizontalScrollWithTouch';
import LogoutButton from './inputs/LogoutButton';
import Loader from './helpers/Loader';

import { styles } from '../styles/main-styles';
import { GROUPS_AND_UPCOMING_EVENTS_QUERY } from '../models/Queries';
import { logError } from './helpers/logError';

export default function LoggedInHome({ navigation }) {
    const { data, errors, loading } = useQuery(GROUPS_AND_UPCOMING_EVENTS_QUERY);

    if(loading) {
        return <Loader />;
    }

    if(errors || !data) {
        logError(errors)
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
                scrollTitle="What's next?"
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