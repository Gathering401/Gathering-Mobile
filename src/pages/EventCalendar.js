import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { CalendarList } from 'react-native-calendars';

import moment from 'moment';

import HorizontalScrollWithTouch from '../components/HorizontalScrollWithTouch';

import { mockEvents } from '../../mockData/mockEvents';
import { mockInvitations } from '../../mockData/mockInvitations';
import { mockEventDetails } from '../../mockData/mockEventDetails';

export default function EventCalendar({ navigation }) {
    let [selected, setSelected] = useState(moment().format('MM/DD/YYYY'));
    let [events, setEvents] = useState(mockEvents);
    let [selectedEvents, setSelectedEvents] = useState([]);
    let [selectedInvitations, setSelectedInvitations] = useState(mockInvitations);

    // useEffect(() => {
    //     function getAllEvents() {
    //        const allEvents = mockEvents;

    // =======================
    // I think the best way to accomplish this in the future is to pull all events from the past 3 months, up through the next 9 months. Then as the user goes beyond those boundaries, scrolling through the months, can stretch 3 months at a time backwards, and 6 months at a time forwards. I think this would help the time management of how many events to filter through when looking at a single days' events, as well as save time in the initial call to the API.
    // =======================

    //        setEvents(allEvents);
    //     }

    //     getAllEvents();
    // }, []);

    const decideSelectedEvents = (day) => {
        const daysEvents = events.filter(e => day.dateString === e.start.substring(0, 10));

        setSelectedEvents(daysEvents);
    }

    const once = { key: 'once', color: 'black' };
    const annual = { key: 'annual', color: 'red' };
    const monthly = { key: 'monthly', color: 'blue' };
    const weekly = { key: 'weekly', color: 'green' };
    const colors = {
        0: weekly,
        1: monthly,
        2: annual,
        3: once
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
                    const dotColor = colors[event.eRepeat]

                    if (!marked[key]) {
                        marked = {
                            ...marked,
                            [key]: { dots: [dotColor] }
                        }
                    } else {
                        marked[key].dots = [...marked[key].dots, dotColor];
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