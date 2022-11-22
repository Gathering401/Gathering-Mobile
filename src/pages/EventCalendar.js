import axios from 'axios';

import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { CalendarList } from 'react-native-calendars';

import moment from 'moment';

import HorizontalScrollWithTouch from '../components/HorizontalScrollWithTouch';

import { mockEventDetails } from '../../mockData/mockEventDetails';

const baseUrl = 'http://localhost:5000/api';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdCIsIkFzcE5ldC5JZGVudGl0eS5TZWN1cml0eVN0YW1wIjoiRkNCTFQ2WlUyNUdXR01LUFFaUDYzMktQWlhKT0tTWVUiLCJleHAiOjE2NzE3NDM0MjJ9.bNr9tV0YTR1EaO-SOnI-LdS0Mj33RYvp0Q8f0fk83WM';

export default function EventCalendar({ navigation }) {
    let [selected, setSelected] = useState(moment().format('MM/DD/YYYY'));
    let [events, setEvents] = useState([]);
    let [selectedEvents, setSelectedEvents] = useState([]);
    let [selectedInvitations, setSelectedInvitations] = useState([]);

    // =======================
    // I think the best way to accomplish this in the future is to pull all events from the past 3 months, up through the next 9 months. Then as the user goes beyond those boundaries, scrolling through the months, can stretch 3 months at a time backwards, and 6 months at a time forwards. I think this would help the time management of how many events to filter through when looking at a single days' events, as well as save time in the initial call to the API.
    // =======================

    useEffect(() => {
        async function getAllEvents() {
            const response = await axios({
                method: 'GET',
                url: `${baseUrl}/Calendar`,
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            });

            if(response.data) {
                setEvents(response.data);
            }
        }

        async function getAllInvitations() {
            const response = await axios({
                method: 'GET',
                url: `${baseUrl}/Calendar/Invitations`,
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            });

            if(response.data) {
                setSelectedInvitations(response.data)
            }
        }

        getAllEvents();
        getAllInvitations();
    }, []);

    const decideSelectedEvents = (day) => {
        const daysEvents = events.filter(e => day.dateString === e.start.substring(0, 10));

        setSelectedEvents(daysEvents);
    }

    return (
        <View>
            <CalendarList
                onDayPress={function (day) {
                    setSelected(moment(day.dateString).format('MM/DD/YYYY'));
                    decideSelectedEvents(day);
                }}
                markingType='multi-dot'
                markedDates={events.reduce((marked, event) => {
                    const key = event.start.substring(0, 10);

                    if (!marked[key]) {
                        marked = {
                            ...marked,
                            [key]: { dots: [{color: 'red', key: 1}] }
                        }
                    } else {
                        marked[key].dots = [...marked[key].dots, {color: 'red', key: marked[key].dots.length + 1}];
                    }
                    return marked;
                }, {})}
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
                scrollTitle="Invitations"
                scrollableItems={selectedInvitations}
                titleLocation="eventName"
                mapper="invitationCard"
            />
        </View>
    )
}