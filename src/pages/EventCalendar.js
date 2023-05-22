import axios from 'axios';

import { useState, useEffect, useContext } from 'react';
// import * as SecureStore from 'expo-secure-store';
import { View } from 'react-native';
import { CalendarList } from 'react-native-calendars';

import { TokenContext } from '../tempContext/token-context';

import moment from 'moment-timezone';

import Loader from '../components/helpers/Loader';
import HorizontalScrollWithTouch from '../components/HorizontalScrollWithTouch';
import NavBar from '../components/NavBar';
import CreateButton from '../components/CreateButton';

const baseUrl = 'http://localhost:4000/graphql';
// const authToken = SecureStore.getItemAsync('token');

export default function EventCalendar({ navigation }) {
    const { token } = useContext(TokenContext);
    
    let [selected, setSelected] = useState(moment().format('MM/DD/YYYY'));
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

    useEffect(() => {
        async function getAllEvents() {
            const query = `query GetCalendarEvents {
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

            const { data: { data } } = await axios({
                method: 'POST',
                data: {
                    query
                },
                url: baseUrl,
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).catch(err => console.log(err));

            if(data) {
                const eventsMap = createEventsMap(data.events);

                setEvents(eventsMap);
                newMarkedDates(eventsMap);

                setInvitations(data.invitations);
            }
        }
        
        getAllEvents();
    }, []);

    return (
        <View>
            <CreateButton type="event" setCreated={setEventCreated}/>
            {events.size > 0
                ? <>
                    <CalendarList
                        onDayPress={({dateString}) => {
                            setSelected(moment(dateString).format('MM/DD/YYYY'));

                            setSelectedEvents(setAllSelected(dateString, events));
                        }}
                        markedDates={markedDates}
                        onVisibleMonthsChange={date => {
                            if(date.length === 1) {
                                setCurrentMonth(moment(date[0].dateString, 'YYYY-MM-DD').format('YYYY-MM'));
                                newMarkedDates(events);
                            }
                        }}
                        enableSwipeMonths={true}
                        initialDate={selected}
                        horizontal={true}
                        pagingEnabled={true}
                    />
                    <HorizontalScrollWithTouch
                        scrollTitle={selected}
                        scrollableItems={selectedEvents}
                        titleLocation="eventName"
                        mapper="eventCard"
                    />
                    <HorizontalScrollWithTouch
                        scrollTitle="Pending Invitations"
                        scrollableItems={invitations}
                        titleLocation="eventName"
                        mapper="invitationCard"
                    />
                </>
                : <Loader />
            }
            <NavBar navigation={navigation}/>
        </View>
    )
}