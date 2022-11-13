import { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { styles } from '../styles/main-styles';
import { CalendarList } from 'react-native-calendars';

import { mockEvents } from '../../mockData/mockEvents';

export default function EventCalendar({navigation}) {
    let [selected, setSelected] = useState();
    let [events, setEvents] = useState(mockEvents);

    // useEffect(() => {
    //     function getAllEvents() {
    //        const allEvents = mockEvents;
    //        setEvents(allEvents);
    //     }
    
    //     getAllEvents();
    // }, []);

    const once = {key: 'once', color: 'black'};
    const annual = {key: 'annual', color: 'red'};
    const monthly = {key: 'monthly', color: 'blue'};
    const weekly = {key: 'weekly', color: 'green'};
    const colors = {
        0: weekly,
        1: monthly,
        2: annual,
        3: once
    }
    
    return (
        <View styles={styles.container}>
            <CalendarList
                onDayPress={function(day) {
                    setSelected(day.dateString);
                }}
                markingType='multi-dot'
                markedDates={events.reduce((marked, event) => {
                    const key = event.start.substring(0, 10);
                    const dotColor = colors[event.eRepeat]
                    
                    if(!marked[key]) {
                        marked = {
                            ...marked,
                            [key]: {dots: [dotColor]}
                        }
                    } else {
                        marked[key].dots = [...marked[key].dots, dotColor];
                    }
                    console.log(marked)
                    return marked;
                }, {})}
                initialDate={selected}
                horizontal={true}
                pagingEnabled={true}
            />
        </View>
    )
}