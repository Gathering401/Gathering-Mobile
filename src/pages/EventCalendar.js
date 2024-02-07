import { gql, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View } from 'react-native';
import { CalendarList } from 'react-native-calendars';

import moment from 'moment-timezone';

import Loader from '../components/helpers/Loader';
import HorizontalScrollWithTouch from '../components/HorizontalScrollWithTouch';
import NavBar from '../components/NavBar';
import CreateButton from '../components/CreateButton';

import { styles } from '../styles/main-styles';

import { REACT_APP_API_URL } from '@env';

export default function EventCalendar({ navigation }) {    
    let [selected, setSelected] = useState(moment().format('YYYY-MM-DD'));
    let [events, setEvents] = useState(new Map());
    let [invitations, setInvitations] = useState([]);
    let [selectedEvents, setSelectedEvents] = useState([]);
    let [markedDates, setMarkedDates] = useState({});
    let [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM'));
    let [eventCreated, setEventCreated] = useState(false);

    const createEventsMap = (events) => {
        const eventsMap = new Map();
        for(const event of events) {
            const eventDate = moment(event.eventDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM');
                    
            let singleMonthEvents = eventsMap.get(eventDate);

            if(singleMonthEvents) {
                singleMonthEvents.push(event);
            } else {
                singleMonthEvents = [event];
            }
            eventsMap.set(eventDate, singleMonthEvents);
        }
        return eventsMap;
    }

    const newMarkedDates = (allEvents) => {
        const newMarked = allEvents.get(currentMonth).reduce((marked, event) => {
            const key = moment(event.eventDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD');

            if (!marked[key]) {
                marked = {
                    ...marked,
                    [key]: { color: 'red', marked: true } 
                }
            }
            
            return marked;
        }, {});

        setMarkedDates(newMarked);
    };

    const setAllSelected = (dateString, eventsMap) => {
        const monthEvents = eventsMap.get(moment(dateString).format('YYYY-MM'));
        return (monthEvents ?? []).filter(e => moment(e.eventDate).format('YYYY-MM-DD') === moment(dateString).format('YYYY-MM-DD')) ?? [];
    }

    const EVENT_QUERY = gql`query GetCalendarEvents {
        events: getCalendarEvents {
            eventId
            eventName
            description
            eventDate
            price
            location
        }
        invitations: getPendingInvitations {
            eventDate
            eventName
            rsvp
        }
    }`;

    const { data, errors, loading } = useQuery(EVENT_QUERY);

    if(data) {
        const eventsMap = createEventsMap(data.events);

        setEvents(eventsMap);
        newMarkedDates(eventsMap);

        setInvitations(data.invitations);
    }
    
    if(errors) {
        console.log('Error', errors);
        return null;
    }
    
    if(loading) {
        return <Loader />
    }

    return (
        <View style={{...styles.container, marginTop: '10%'}}>
            <View style={styles.verticalSpread}>
                <CreateButton type="event" setCreated={setEventCreated}/>
                {events.size > 0
                    ? <>
                        <CalendarList
                            onDayPress={({dateString}) => {
                                setSelected(moment(dateString).format('YYYY-MM-DD'));

                                setSelectedEvents(setAllSelected(dateString, events));
                            }}
                            markedDates={markedDates}
                            onVisibleMonthsChange={date => {
                                if(date.length === 1) {
                                    setCurrentMonth(moment(date[0].dateString, 'YYYY-MM-DD').format('YYYY-MM'));
                                    newMarkedDates(events);
                                }
                            }}
                            enableSwipeMonths={false}
                            initialDate={selected}
                            horizontal={true}
                            pagingEnabled={true}
                        />
                        <HorizontalScrollWithTouch
                            scrollTitle={selected}
                            scrollableItems={selectedEvents}
                            titleLocation="eventName"
                            mapper="event"
                            navigation={navigation}
                        />
                        <HorizontalScrollWithTouch
                            scrollTitle="Pending Invitations"
                            scrollableItems={invitations}
                            titleLocation="eventName"
                            mapper="invitation"
                            navigation={navigation}
                        />
                    </>
                    : <Loader />
                }
            </View>
            <NavBar navigation={navigation}/>
        </View>
    )
}