import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Icon, Button } from 'react-native-paper';

import { DateTime } from 'luxon';

import HorizontalScrollWithTouch from '../components/HorizontalScrollWithTouch';

import { styles } from '../styles/main-styles';
import { EVENT_QUERY } from '../models/Queries';

export default function EventCalendar({ navigation }) {
    const [currentDate, setCurrentDate] = useState(DateTime.now());
    const [variables, setVariables] = useState({});
    const [selectedDate, setSelectedDate] = useState(DateTime.now());
    const [markedDates, setMarkedDates] = useState({});

    const { data, loading, errors } = useQuery(EVENT_QUERY, {
        fetchPolicy: "no-cache",
        variables: {
            ...variables,
            month: currentDate.month,
            year: currentDate.year
        },
        onCompleted: ({events}) => {
            setMarkedDates(events.reduce((a,c) => {
                const date = c.eventDate.substring(0,10);
                if(!a[date]) {
                    a[date] = {marked: true}
                }
                return a;
            }, {}));
        }
    });
    
    if(errors) {
        console.log('Error', JSON.stringify(errors, null, 2));
        return null;
    }

    return (
        <SafeAreaView style={styles.calendarContainer}>
            <Calendar
                style={styles.calendar}
                onMonthChange={(date) => {
                    setCurrentDate(DateTime.fromISO(date.dateString))
                    setSelectedDate(DateTime.fromISO(date.dateString))
                }}
                displayLoadingIndicator={loading}
                initialDate={selectedDate.toISO()}
                markedDates={markedDates}
                onDayPress={(date) => setSelectedDate(DateTime.fromISO(date.dateString))}
            />
            <Button
                mode='outlined'
                style={styles.button}
                onPress={() => navigation.navigate('CalendarTab', {
                    screen: 'Create Event'
                })}>
                <Icon source='plus' color='#042A2B' />New Event
            </Button>
            <View style={{height: '40%'}}>
                <HorizontalScrollWithTouch
                    scrollTitle={`Events on ${selectedDate.toFormat('DDD')}`}
                    scrollableItems={(data?.events ?? []).filter(e => DateTime.fromISO(e.eventDate).startOf('day').equals(selectedDate.startOf('day')))}
                    mapper="event"
                    navigation={navigation}
                />
                {data?.invitations?.length ? <HorizontalScrollWithTouch
                    scrollTitle="Pending Invitations"
                    scrollableItems={invitations}
                    mapper="invitation"
                    navigation={navigation}
                /> : null}
            </View>
        </SafeAreaView>
    )
}