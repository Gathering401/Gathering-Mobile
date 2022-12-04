import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import moment from 'moment';

import Label from '../Label';

import { styles } from '../../styles/main-styles';

export default function DateInput({ label, setDate, date }) {
    let [open, setOpen] = useState(false);
    
    return (
        <View style={styles.inputAndLabel}>
            <Label text={label} />
            <TouchableOpacity onPress={() => setOpen(!open)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>{moment(date).format('MM/DD/YYYY')}</Text>
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
                    onSelectedChange={newDate => setDate(moment(newDate).toISOString())}
                />
            </View>
        </View>
    )
}