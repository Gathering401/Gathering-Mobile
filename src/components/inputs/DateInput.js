import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, CheckBox } from 'react-native';

import DatePicker from 'react-native-modern-datepicker';
import moment from 'moment-timezone';

import Label from '../Label';
import EventRepeatSelection from './EventRepeatSelection';

import { styles } from '../../styles/main-styles';

export default function DateInput({ label, fieldName, setFieldValue, required }) {
    let [open, setOpen] = useState(false);
    let [localRepeat, setLocalRepeat] = useState('never');
    let [showRepeat, setShowRepeat] = useState(false);
    let [displayDate, setDisplayDate] = useState(moment().format('MMMM Do, YYYY'));
    let [dateFromDate, setDateFromDate] = useState(new Date());

    const handleFieldChange = useCallback((value) => {
        const momentDate = moment(value);
        
        setDateFromDate(value);
        setFieldValue(fieldName, momentDate.toISOString());
        determineDisplayDate(value);
    }, [setFieldValue]);

    const determineDisplayDate = (_date) => {
        const momentDate = moment(_date);
        switch(localRepeat) {
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
                setDisplayDate(momentDate.format('MMMM Do, YYYY'));
                break;
        }
    }
    
    return (
        <View style={styles.inputAndLabel}>
            <Label text={label} required={required}/>
            <TouchableOpacity onPress={() => setOpen(!open)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>{displayDate}</Text>
            </TouchableOpacity>
            <View style={{...(open ? {} : styles.hidden)}}>
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
                    date={dateFromDate}
                    onSelectedChange={handleFieldChange}
                />
            </View>
            <Label text="Is it recurring?" />
            <CheckBox
                value={showRepeat}
                onValueChange={() => setShowRepeat(!showRepeat)}
            />
            {showRepeat &&
                <View>
                    <EventRepeatSelection
                        setShowRepeat={setShowRepeat}
                        setFieldValue={setFieldValue}
                        setRepeat={setLocalRepeat}
                        setDisplay={determineDisplayDate}
                        selectedDate={dateFromDate}
                        value='Weekly'
                    />
                    <EventRepeatSelection
                        setShowRepeat={setShowRepeat}
                        setFieldValue={setFieldValue}
                        setRepeat={setLocalRepeat}
                        setDisplay={determineDisplayDate}
                        selectedDate={dateFromDate}
                        value='Monthly'
                    />
                    <EventRepeatSelection
                        setShowRepeat={setShowRepeat}
                        setFieldValue={setFieldValue}
                        setRepeat={setLocalRepeat}
                        setDisplay={determineDisplayDate}
                        selectedDate={dateFromDate}
                        value='Annually'
                    />
                    <EventRepeatSelection
                        setShowRepeat={setShowRepeat}
                        setFieldValue={setFieldValue}
                        setRepeat={setLocalRepeat}
                        setDisplay={determineDisplayDate}
                        selectedDate={dateFromDate}
                        value='Never'
                    />
                </View>
            }
        </View>
    )
}