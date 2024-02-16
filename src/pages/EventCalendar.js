import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import moment from 'moment-timezone';

import Loader from '../components/helpers/Loader';
import HorizontalScrollWithTouch from '../components/HorizontalScrollWithTouch';
import CreateButton from '../components/CreateButton';

import { styles } from '../styles/main-styles';

export default function EventCalendar({ navigation }) {
    const [currentDate, setCurrentDate] = useState(moment());
    const [variables, setVariables] = useState({});
    const [selectedDate, setSelectedDate] = useState(moment());
    
    const EVENT_QUERY = gql`query GetCalendarEvents($groupId: Int, $repeat: EventRepeat, $month: Int, $year: Int) {
        events: getCalendarEvents(groupId: $groupId, repeat: $repeat, month: $month, year: $year) {
            eventId
            groupId
            eventName
            description
            eventDate
            price
            location
        }
        invitations: getPendingInvitations {
            eventId
            groupId
            eventDate
            eventName
            rsvp
        }
    }`;

    const { data, errors, loading } = useQuery(EVENT_QUERY, {
        variables: {
            ...variables,
            month: currentDate.month() + 1,
            year: currentDate.year()
        }
    });
    
    if(errors) {
        console.log('Error', errors);
        return null;
    }

    if(loading) {
        return <Loader />
    }

    return (
        <View style={styles.calendarContainer}>
            {/* <CreateButton type="event" setCreated={setEventCreated} navigation={navigation}/> */}
            {data?.events?.length > 0
                ? <>
                    <Calendar
                        style={styles.calendar}
                        onMonthChange={(date) => {
                            setCurrentDate(moment(date.dateString))
                            setSelectedDate(moment(date.dateString))
                        }}
                        initialDate={currentDate.toISOString()}
                        markedDates={data.events.reduce((a,c) => {
                            const date = c.eventDate.substring(0,10);
                            if(!a[date]) {
                                a[date] = {marked: true}
                            }
                            return a;
                        }, {})}
                        onDayPress={(date) => setSelectedDate(moment(date).subtract(1, 'month'))}
                    />
                    <View style={{height: '40%'}}>
                        <HorizontalScrollWithTouch
                            scrollTitle={`Events on ${selectedDate.format('MMMM Do')}`}
                            scrollableItems={data.events.filter(e => moment(e.eventDate).startOf('day').isSame(selectedDate.startOf('day')))}
                            mapper="event"
                            navigation={navigation}
                        />
                        {data.invitations?.length ? <HorizontalScrollWithTouch
                            scrollTitle="Pending Invitations"
                            scrollableItems={invitations}
                            mapper="invitation"
                            navigation={navigation}
                        /> : null}
                    </View>
                </>
                : <Loader />
            }
        </View>
    )
}