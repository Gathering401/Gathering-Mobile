import { useState } from 'react';

import { TouchableOpacity } from 'react-native';

import GroupCreate from './GroupCreate';
import EventCreate from './EventCreate';

import { styles } from '../styles/main-styles';
import { Button } from 'react-native-paper';

export default function CreateButton({ type, setCreated }) {
    let [showGroupCreate, setShowGroupCreate] = useState(false);
    let [showEventCreate, setShowEventCreate] = useState(false);

    const closeGroupCreate = (groupCreate) => {
        setShowGroupCreate(groupCreate);
        setCreated(true);
    }

    const closeEventCreate = (eventCreate) => {
        setShowEventCreate(eventCreate);
        setCreated(true);
    }
    
    switch(type) {
        case 'group':
            if(showGroupCreate) {
                return <GroupCreate close={closeGroupCreate}/>
            } else {
                return (
                    <Button icon="plus" onPress={() => setShowGroupCreate(true)}>New</Button>
                )
            }
        case 'event':
            if(showEventCreate) {
                return <EventCreate close={closeEventCreate}/>
            } else {
                return (
                    <TouchableOpacity style={styles.createButton} onPress={() => setShowEventCreate(true)}>
                        {/* <BsCalendarPlus /> */}
                    </TouchableOpacity>
                )
            }
    }
}