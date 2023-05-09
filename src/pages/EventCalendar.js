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
    let [selectedEvents, setSelectedEvents] = useState([]);
    let [markedDates, setMarkedDates] = useState({});
    let [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM'));
    let [selectedInvitations, setSelectedInvitations] = useState([]);
    let [eventCreated, setEventCreated] = useState(false);

    // =======================
    // I think the best way to accomplish this in the future is to pull all events from the past 3 months, up through the next 9 months. Then as the user goes beyond those boundaries, scrolling through the months, can stretch 3 months at a time backwards, and 6 months at a time forwards. I think this would help the time management of how many events to filter through when looking at a single days' events, as well as save time in the initial call to the API.
    // =======================

    useEffect(() => {
        async function getAllEvents() {
            const query = `query GetCalendarEvents {
                events: getCalendarEvents {
                    eventId
                    groupId
                    eventName
                    description
                    eventDate
                    groupName
                    price
                    food
                    invitedUsers {
                        userId
                        username
                        rsvp
                    }
                    location {
                        locationName
                    }
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

            console.log('did we get events', data);

            const eventsMap = new Map();
            if(data) {
                for(const event of data.events) {
                    const eventDate = moment(event.eventDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM');
                    
                    let singleDateEvents = eventsMap.get(eventDate);

                    if(singleDateEvents) {
                        singleDateEvents.push(event);
                    } else {
                        singleDateEvents = [event];
                    }
                    eventsMap.set(eventDate, singleDateEvents);
                }

                setEvents(eventsMap);
                newMarkedDates(eventsMap);
            }
        }
        
        getAllEvents();
    }, []);

    const newMarkedDates = (allEvents) => {
        console.log('canada', allEvents, currentMonth)
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

    return (
        <View>
            <CreateButton type="event" setCreated={setEventCreated}/>
            {events.size > 0
                ? <>
                    <CalendarList
                        onDayPress={(day) => {
                            setSelected(moment(day.dateString).format('MM/DD/YYYY'));

                            const monthEvents = events.get(moment(day.dateString).format('YYYY-MM'));
                            const dayEvents = monthEvents.filter(e => moment(e.eventDate).format('YYYY-MM-DD') === moment(day.dateString).format('YYYY-MM-DD'));
                            setSelectedEvents(dayEvents ?? []);
                        }}
                        markedDates={markedDates}
                        onVisibleMonthsChange={date => {
                            if(date.length === 1) {
                                console.log(date);
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
                </>
            : <Loader />}
            {/* <HorizontalScrollWithTouch
                scrollTitle="Invitations"
                scrollableItems={selectedInvitations}
                titleLocation="eventName"
                mapper="invitationCard"
            /> */}
            <NavBar navigation={navigation}/>
        </View>
    )
}