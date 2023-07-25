import { useState, useCallback } from 'react';
import { View, Button, TouchableOpacity, Text, CheckBox, SafeAreaView } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment-timezone';

import Label from '../Label';
import EventRepeatSelection from './EventRepeatSelection';

import { styles } from '../../styles/main-styles';

export default function DateInput({ label, fieldName, setFieldValue, required }) {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
  
    const onChange = (_, selectedDate) => {
      const currentDate = selectedDate;
      setShow(false);
      setDate(currentDate);
      setFieldValue(fieldName, currentDate);
    };
  
    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };
  
    const showDatepicker = () => {
      showMode('date');
    };
  
    const showTimepicker = () => {
      showMode('time');
    };

    return (
        <View style={styles.inputAndLabel}>
            <Label text={label} required={required}/>
            <SafeAreaView>
                <Button onPress={showDatepicker} title={moment(date).format('MM/DD/YYYY')} />
                <Button onPress={showTimepicker} title={moment(date).format('HH:mm')} />
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                    />
                )}
            </SafeAreaView>
            {/* <Label text="Is it recurring?" />
            <CheckBox
                value={showRepeat}
                onValueChange={() => setShowRepeat(!showRepeat)}
            />
            {showRepeat &&
                <View>
                    <EventRepeatSelection
                        setShowRepeat={setShowRepeat}
                        setFieldValue={setFieldValue}
                        setDisplay={determineDisplayDate}
                        selectedDate={dateFromDate}
                        value='Weekly'
                    />
                    <EventRepeatSelection
                        setShowRepeat={setShowRepeat}
                        setFieldValue={setFieldValue}
                        setDisplay={determineDisplayDate}
                        selectedDate={dateFromDate}
                        value='Monthly'
                    />
                    <EventRepeatSelection
                        setShowRepeat={setShowRepeat}
                        setFieldValue={setFieldValue}
                        setDisplay={determineDisplayDate}
                        selectedDate={dateFromDate}
                        value='Annually'
                    />
                    <EventRepeatSelection
                        setShowRepeat={setShowRepeat}
                        setFieldValue={setFieldValue}
                        setDisplay={determineDisplayDate}
                        selectedDate={dateFromDate}
                        value='Never'
                    />
                </View>
            }*/}
        </View>
    )
}