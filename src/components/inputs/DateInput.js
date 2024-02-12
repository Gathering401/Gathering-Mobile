import { useState, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';

import { DateTime } from 'luxon';

import { DatePickerModal } from 'react-native-paper-dates';

export default function DateInput({ label, fieldName, setFieldValue }) {
    let [date, setDate] = useState(new Date());
    let [show, setShow] = useState(false);

    const onConfirm = (date) => {
        setShow(false);
        setDate(date);
        setFieldValue(fieldName, DateTime.fromJSDate(date).startOf('day'));
    }

    const onDismiss = () => {
        setShow(false);
    }

    return (
        <View>
            <SafeAreaView>
                <Button onPress={() => setShow(true)} uppercase={false}>{label}: {DateTime.fromJSDate(date).toFormat('DDD')}</Button>
                <DatePickerModal
                    locale="en"
                    mode="single"
                    visible={show}
                    onDismiss={onDismiss}
                    date={date}
                    onConfirm={({date}) => onConfirm(date)}
                />
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