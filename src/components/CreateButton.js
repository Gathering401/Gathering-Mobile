import React, { useState } from 'react';

import { TouchableOpacity } from 'react-native';
import { BsCalendarPlus, BsPlus, BsPeople } from 'react-icons/bs';

import GroupCreate from './GroupCreate';
import EventCreate from './EventCreate';

import { styles } from '../styles/main-styles';

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
                    <TouchableOpacity style={styles.createButton} onPress={() => setShowGroupCreate(true)}>
                        <BsPeople /><BsPlus />
                    </TouchableOpacity>
                )
            }
        case 'event':
            if(showEventCreate) {
                return <EventCreate close={closeEventCreate}/>
            } else {
                return (
                    <TouchableOpacity style={styles.createButton} onPress={() => setShowEventCreate(true)}>
                        <BsCalendarPlus />
                    </TouchableOpacity>
                )
            }
        default:
            console.log('Not a create button.');
            break;
    }
}