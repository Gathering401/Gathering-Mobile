import { useState } from 'react';

import { TouchableOpacity } from 'react-native';

import EventCreate from './EventCreate';

import { styles } from '../styles/main-styles';
import { Button } from 'react-native-paper';

export default function CreateButton({ type, navigation }) {
    let [showEventCreate, setShowEventCreate] = useState(false);

    const openCreateGroupForm = () => {
        navigation.navigate('GroupsTab', {
            screen: 'Create Group'
        })
    }

    const closeEventCreate = (eventCreate) => {
        setShowEventCreate(eventCreate);
        setCreated(true);
    }
    
    switch(type) {
        case 'group':
            return <Button mode='outlined' onPress={() => openCreateGroupForm()}>New Group</Button>
        case 'event':
            if(showEventCreate) {
                return <EventCreate navigation={navigation} close={closeEventCreate}/>
            } else {
                return (
                    <TouchableOpacity style={styles.createButton} onPress={() => setShowEventCreate(true)}>
                        {/* <BsCalendarPlus /> */}
                    </TouchableOpacity>
                )
            }
    }
}