import React, { useState } from 'react';
import { View, TouchableOpacity, Text, CheckBox } from 'react-native';

import DatePicker from 'react-native-modern-datepicker';
import moment from 'moment-timezone';

import Label from '../Label';
import EventRepeatSelection from './EventRepeatSelection';

import { styles } from '../../styles/main-styles';

export default function DateInput({ label, date, setDate, repeat, setRepeat, required }) {
    let [open, setOpen] = useState(false);
    let [showRepeat, setShowRepeat] = useState(false);
    let [displayDate, setDisplayDate] = useState(moment().format('MMMM Do, YYYY'));

    const determineSetDate = (date) => {
        const momentDate = moment(date);
        
        setDate(momentDate.toISOString());
        switch(repeat) {
            case 'weekly':
                setDisplayDate(`Every ${momentDate.format('dddd')}, starting ${momentDate.format('MM/DD/YYYY')}`);
                break;
            case 'monthly':
                setDisplayDate(`${momentDate.format('Do')} every month, starting ${momentDate.format('MM/DD/YYYY')}`);
                break;
            case 'annually':
                setDisplayDate(`Every year on ${momentDate.format('MMMM Do')}, starting ${momentDate.format('MM/DD/YYYY')}`);
                break;
            default:
                setDisplayDate(moment(date).format('MMMM Do, YYYY'))
                break;
        }
    }
    
    return (
        <View style={styles.inputAndLabel}>
            <Label text={label} required={required}/>
            <TouchableOpacity onPress={() => setOpen(!open)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>{displayDate}</Text>
            </TouchableOpacity>
            <View style={{...open ? {} : styles.hidden}}>
                <DatePicker
                    options={{
                        backgroundColor: '#090C08',
                        textHeaderColor: '#FFA25B',
                        textDefaultColor: '#F6E7C1',
                        selectedTextColor: '#fff',
                        mainColor: '#F4722B',
                        textSecondaryColor: '#D6C7A1',
                        borderColor: 'rgba(122, 146, 165, 0.1)',
                    }}
                    mode='calendar'
                    date={date}
                    onSelectedChange={newDate => determineSetDate(newDate)}
                />
            </View>
            <Label text="Is it recurring?" />
            <CheckBox
                value={showRepeat}
                onValueChange={() => setShowRepeat(!showRepeat) }
            />
            {showRepeat &&
                <View>
                    <EventRepeatSelection setShowRepeat={setShowRepeat} setRepeat={setRepeat} value='Weekly'/>
                    <EventRepeatSelection setShowRepeat={setShowRepeat} setRepeat={setRepeat} value='Monthly'/>
                    <EventRepeatSelection setShowRepeat={setShowRepeat} setRepeat={setRepeat} value='Annually'/>
                    <EventRepeatSelection setShowRepeat={setShowRepeat} setRepeat={setRepeat} value='Never'/>
                </View>
            }
        </View>
    )
}